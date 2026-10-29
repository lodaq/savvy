# Application Problems & Issues Backlog

This backlog tracks architectural, functional, security, and tooling issues discovered during the repository investigation of Savvy CMS.

---

## 1. Git & Deployment Integrity

- [x] **Track and Commit the Next.js Application in Git**
  - **Description**: The entire Next.js codebase ([`app/`](file:///home/sebaq/repos/savvy/app), [`actions/`](file:///home/sebaq/repos/savvy/actions), [`components/`](file:///home/sebaq/repos/savvy/components), [`lib/`](file:///home/sebaq/repos/savvy/lib), [`models/`](file:///home/sebaq/repos/savvy/models), [`package.json`](file:///home/sebaq/repos/savvy/package.json), [`tsconfig.json`](file:///home/sebaq/repos/savvy/tsconfig.json), [`next.config.ts`](file:///home/sebaq/repos/savvy/next.config.ts), [`postcss.config.mjs`](file:///home/sebaq/repos/savvy/postcss.config.mjs), [`proxy.ts`](file:///home/sebaq/repos/savvy/proxy.ts), [`scripts/`](file:///home/sebaq/repos/savvy/scripts), [`components.json`](file:///home/sebaq/repos/savvy/components.json), and [`.env.example`](file:///home/sebaq/repos/savvy/.env.example)) was untracked on Git. Only the deprecated `client/` and `server/` directories were tracked on `main`.
  - **Resolution**: Staged the deleted legacy files and staged all active Next.js application files into Git (`git add -A`).

---

## 2. Tooling, Linting & Dependencies

- [x] **Fix Broken Lint Script in `package.json`**
  - **Description**: In [`package.json`](file:///home/sebaq/repos/savvy/package.json#L9), `"lint": "next lint"` failed with invalid directory error in Next.js 16.
  - **Resolution**: Updated script to `"lint": "eslint ."`.

- [x] **Configure ESLint 10 Flat Config (`eslint.config.mjs`)**
  - **Description**: ESLint `v10.13.0` crashed without flat config.
  - **Resolution**: Created [`eslint.config.mjs`](file:///home/sebaq/repos/savvy/eslint.config.mjs) integrating `eslint-config-next` rules and pinned typescript to `6.0.3` for full parser compatibility. Passing with 0 errors and 0 warnings.

- [x] **Fix Phantom Dependency: `@radix-ui/react-icons`**
  - **Description**: Undeclared `@radix-ui/react-icons` was imported across select, dialog, and dropdown components.
  - **Resolution**: Replaced all Radix icon imports in [`components/ui/select.tsx`](file:///home/sebaq/repos/savvy/components/ui/select.tsx), [`components/ui/dialog.tsx`](file:///home/sebaq/repos/savvy/components/ui/dialog.tsx), and [`components/ui/dropdown-menu.tsx`](file:///home/sebaq/repos/savvy/components/ui/dropdown-menu.tsx) with icons from `lucide-react`.

- [x] **Prune Unused Dependencies in `package.json`**
  - **Description**: `@hookform/resolvers` and `react-hook-form` were installed but unused.
  - **Resolution**: Uninstalled both packages from `package.json`.

---

## 3. Data Integrity & Multi-Tenancy

- [x] **Fix Multi-Tenant Slug Collision in `models/article.ts`**
  - **Description**: `slug` had a global unique index, crashing across multiple authors.
  - **Resolution**: Replaced with compound unique index `{ userId: 1, slug: 1 }` in [`models/article.ts`](file:///home/sebaq/repos/savvy/models/article.ts), and updated [`actions/articles.ts`](file:///home/sebaq/repos/savvy/actions/articles.ts) to scope slug generation and reads by `userId`.

---

## 4. Input Validation & Schemas

- [x] **Wire Up Zod Validation to Actions and API Routes**
  - **Description**: Input schemas in [`lib/validators.ts`](file:///home/sebaq/repos/savvy/lib/validators.ts) were bypassed.
  - **Resolution**: Wired Zod runtime schema validation into [`actions/shares.ts`](file:///home/sebaq/repos/savvy/actions/shares.ts), [`actions/articles.ts`](file:///home/sebaq/repos/savvy/actions/articles.ts), and [`actions/gallery.ts`](file:///home/sebaq/repos/savvy/actions/gallery.ts).

- [x] **Add `'code'` Share Type to Validation Schemas**
  - **Description**: `code` snippet shares lacked schema representation in validators.
  - **Resolution**: Added `CodeShareSchema` and included `'code'` in `ShareTypeEnum` in [`lib/validators.ts`](file:///home/sebaq/repos/savvy/lib/validators.ts).

---

## 5. Feed & Content Interactions

- [x] **Re-scrape OpenGraph Metadata on Link Updates**
  - **Description**: Updating a link share URL retained stale OpenGraph card metadata.
  - **Resolution**: Added OpenGraph re-scraping in [`updateShare`](file:///home/sebaq/repos/savvy/actions/shares.ts) when a link's URL changes.

- [x] **Persist Like State Per User to Prevent Like Spam**
  - **Description**: Likes were tracked only in ephemeral local React state and allowed unlimited liking.
  - **Resolution**: Added `likedBy: string[]` to [`models/share.ts`](file:///home/sebaq/repos/savvy/models/share.ts), updated [`actions/shares.ts`](file:///home/sebaq/repos/savvy/actions/shares.ts) `likeShare` with atomic `$addToSet` / `$pull` toggle, and wired user-specific like state in [`components/feed/post-card.tsx`](file:///home/sebaq/repos/savvy/components/feed/post-card.tsx).

---

## 6. Authentication & Route Protection

- [x] **Migrate to Resource-Based Auth (Resolve `createRouteMatcher` Deprecation)**
  - **Description**: Clerk v5/v6 deprecates middleware path matching via `createRouteMatcher` in favor of resource-based checks directly at the data and view boundaries.
  - **Resolution**: Exported bare `clerkMiddleware()` in [`proxy.ts`](file:///home/sebaq/repos/savvy/proxy.ts) and verified all protected routes are enforced with `await auth.protect()` in [`app/(dashboard)/layout.tsx`](file:///home/sebaq/repos/savvy/app/(dashboard)/layout.tsx) and authenticated checks in API routes and Server Actions.
