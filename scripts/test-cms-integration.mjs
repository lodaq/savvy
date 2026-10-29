import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { stripTypeScriptTypes } from 'node:module';
import { test } from 'node:test';
import vm from 'node:vm';

// Stub only service boundaries; execute the real route/action/helper code.
async function load(file, dependencies = {}, globals = {}) {
  const context = vm.createContext({ console, URL, process: { env: {} }, ...globals });
  const source = stripTypeScriptTypes(await readFile(new URL(`../${file}`, import.meta.url), 'utf8'));
  const module = new vm.SourceTextModule(source, { context });
  await module.link((name) => {
    assert.ok(name in dependencies, `Unexpected dependency: ${name}`);
    const values = dependencies[name];
    return new vm.SyntheticModule(Object.keys(values), function () {
      for (const [key, value] of Object.entries(values)) this.setExport(key, value);
    }, { context });
  });
  await module.evaluate();
  return module.namespace;
}

for (const endpoint of ['articles', 'articles/[slug]', 'shares', 'gallery']) {
  test(`${endpoint}: owner-scoped reads cannot enter a shared HTTP cache`, async () => {
    let owner = 'owner-a';
    const query = {
      select() { return this; }, sort() { return this; }, limit() { return this; },
      async lean() { return [{ userId: owner }]; },
    };
    const model = {
      find(filter) { assert.equal(filter.userId, owner); return query; },
      findOne(filter) {
        assert.equal(filter.userId, owner);
        assert.equal(filter.published, true);
        return query;
      },
    };
    const { GET } = await load(`app/api/v1/${endpoint}/route.ts`, {
      'next/server': { NextRequest: Request, NextResponse: Response },
      '@/lib/mongodb': { default: async () => {} },
      '@/lib/api-auth': { authenticateApiKey: async () => owner },
      '@/models/article': { default: model },
      '@/models/share': { ShareModel: model },
      '@/models/gallery-image': { default: model },
    });
    for (owner of ['owner-a', 'owner-b']) {
      const response = await GET(new Request('https://cms.example/api/v1/test'), {
        params: Promise.resolve({ slug: 'post' }),
      });
      assert.equal(response.headers.get('cache-control'), 'private, no-store');
      assert.equal((await response.json())[0].userId, owner);
    }
    owner = null;
    const response = await GET(new Request('https://cms.example/api/v1/test'), { params: Promise.resolve({ slug: 'post' }) });
    assert.equal(response.status, 401);
  });
}

test('portfolio notifications are bounded and do not forward the secret through redirects', async () => {
  const requests = [];
  const env = { PORTFOLIO_URL: 'https://portfolio.example/', PORTFOLIO_REVALIDATE_SECRET: 'test-secret' };
  const { notifyPortfolioRevalidate } = await load('lib/notify-portfolio.ts', {}, {
    process: { env }, AbortSignal: { timeout(ms) { assert.equal(ms, 5000); return AbortSignal.timeout(ms); } },
    fetch: async (url, options) => { requests.push({ url, ...options }); return { ok: true }; },
  });
  await notifyPortfolioRevalidate('hello');
  assert.equal(requests[0].url, 'https://portfolio.example/api/revalidate');
  assert.equal(requests[0].body, JSON.stringify({ slug: 'hello' }));
  assert.equal(requests[0].headers['x-revalidate-secret'], 'test-secret');
  assert.equal(requests[0].redirect, 'error');
  assert.ok(requests[0].signal instanceof AbortSignal);
  delete env.PORTFOLIO_URL;
  await notifyPortfolioRevalidate();
  assert.equal(requests.length, 1);
});

test('portfolio outages do not turn saved content into a failed mutation', async () => {
  const { notifyPortfolioRevalidate } = await load('lib/notify-portfolio.ts', {}, {
    process: { env: { PORTFOLIO_URL: 'https://portfolio.example', PORTFOLIO_REVALIDATE_SECRET: 'test' } },
    AbortSignal, console: { warn() {} }, fetch: async () => { throw new Error('offline'); },
  });
  await assert.doesNotReject(notifyPortfolioRevalidate('post'));
});

test('imports refresh successful slugs, including partial batches, but never skipped or failed files', async () => {
  const notified = [];
  const { importArticles } = await load('actions/import-articles.ts', {
    '@clerk/nextjs/server': { auth: async () => ({ userId: 'owner' }) },
    '@/lib/mongodb': { default: async () => {} },
    '@/models/article': { ArticleType: undefined, default: {
      findOne: async ({ $or }) => $or[0].slug === 'existing' ? {} : null,
      create: async (data) => { if (data.slug === 'failed') throw new Error('write failed'); },
    } },
    '@/lib/utils': { slugify: (text) => text.toLowerCase().replaceAll(' ', '-') },
    'next/cache': { revalidatePath() {} },
    '@/lib/notify-portfolio': { notifyPortfolioRevalidate: async (slug) => notified.push(slug) },
  });
  const result = await importArticles(['new', 'existing', 'failed'].map((name) => ({ filename: `${name}.mdx`, raw: '# Body' })));
  assert.equal(result.imported, 1);
  assert.equal(result.skipped, 1);
  assert.deepEqual(notified, ['new']);
});
