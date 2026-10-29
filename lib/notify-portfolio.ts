/**
 * Tells the portfolio site (magic-lamp) that CMS content changed, so it can
 * drop its cached copy and serve the new version immediately.
 *
 * The portfolio caches CMS responses for an hour. Without this hook a
 * freshly published post would not appear on the site for up to that long.
 *
 * Configuration (environment variables on the CMS):
 *   - `PORTFOLIO_URL`      — the portfolio base URL, e.g. https://magic-lamp.vercel.app
 *   - `PORTFOLIO_REVALIDATE_SECRET` — the shared secret, matching the
 *     portfolio's `REVALIDATE_SECRET`.
 *
 * When either is missing the call is skipped silently: the portfolio still
 * picks the change up on its own within the cache window.
 */
export async function notifyPortfolioRevalidate(slug?: string): Promise<void> {
  const baseUrl = process.env.PORTFOLIO_URL;
  const secret = process.env.PORTFOLIO_REVALIDATE_SECRET;

  if (!baseUrl || !secret) return;

  const endpoint = `${baseUrl.replace(/\/+$/, '')}/api/revalidate`;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      signal: AbortSignal.timeout(5000),
      redirect: 'error',
      headers: {
        'Content-Type': 'application/json',
        'x-revalidate-secret': secret,
      },
      body: JSON.stringify(slug ? { slug } : {}),
    });

    if (!res.ok) {
      console.warn(`[revalidate] Portfolio revalidation failed with ${res.status}.`);
    }
  } catch (error) {
    // Never let a portfolio hiccup break publishing.
    console.warn('[revalidate] Could not reach the portfolio to revalidate:', error);
  }
}
