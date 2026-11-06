# Savvy — Personal Content Management & Curation System

![Status: Under development](https://img.shields.io/badge/status-under_development-orange)

A modern, full-stack CMS and digital workspace built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Mongoose 9**. Savvy empowers you to capture, curate, write, and serve diverse content formats seamlessly using Clerk authentication, MongoDB, and Uploadthing. Hosting and service limits depend on the providers and selected plans.

---

## Development status

The CMS and portfolio API are under active development. The [hosted app](https://savvycms.vercel.app) responded successfully when checked on 2026-11-06. The older `savvy-z.vercel.app` address returned HTTP 404. Running the CMS requires the configured authentication and data services; a local build or homepage response alone does not verify authenticated publishing workflows. Keep server credentials private. The API integration limitations below are part of the current contract.

## Features

### 1. Multi-Format Content Feed ("Shares")
- **Polymorphic Content Model**: Store and render 6 distinct content formats:
  - **Links**: Automated OpenGraph scraping (`open-graph-scraper`) rendering Notion-style rich bookmark cards with favicon, description, and cover image.
  - **Videos**: Responsive YouTube player embeds.
  - **Shorts**: Vertical YouTube Shorts player embeds.
  - **Quotes**: Elegant typographic blockquotes with author attribution and language direction (RTL/LTR) detection.
  - **Images**: Direct image posts with captions.
  - **Notes / Text**: Markdown notes and quick thoughts.
- **Interactions**: Like count tracking, social sharing (Twitter/X, Facebook, link copying), editing, and deletion.

### 2. In-App MDX Publishing
- **Interactive In-Browser Editor**: Notion-like WYSIWYG editing powered by `@mdxeditor/editor` (Lexical).
- **Server-Rendered MDX**: Lightning-fast compilation and delivery using `next-mdx-remote/rsc`.
- **Rich Embeds & Syntax Highlighting**: Custom React components embedded in MDX (callouts, code highlighting with highlight.js themes, responsive images, tables).
- **Draft & Publishing Controls**: Draft/Published status toggle, tag organization, and automatic slug generation.

### 3. Cloud Media Gallery
- **High-Speed CDN Uploads**: Direct uploads via **Uploadthing** with automatic authentication and database indexing.
- **Masonry Layout**: Responsive CSS column-based masonry grid with zero JavaScript layout shifting.
- **Asset Management**: One-click CDN URL copying, direct file downloading, and cloud deletion.

### 4. Managed Authentication & Security
- **Clerk**: Complete session and authentication management with Next.js App Router middleware route protection.
- **Tenant Isolation**: User data isolated by authenticated `userId` in MongoDB collections.

---

## Tech Stack

| Service | Technology | Hosting notes |
|---|---|---|
| **Framework** | Next.js 16 (App Router, Server Components) | Open Source |
| **Language** | TypeScript (Strict mode) | Open Source |
| **Authentication** | [@clerk/nextjs](https://clerk.com) | Clerk plan limits apply |
| **Database** | MongoDB Atlas via Mongoose 9 | Atlas plan limits apply |
| **Storage / CDN** | [Uploadthing](https://uploadthing.com) | Uploadthing plan limits apply |
| **MDX Engine** | next-mdx-remote + @mdxeditor/editor | Open Source |
| **Styling & UI** | Tailwind CSS + Shadcn UI + Radix UI + Lucide | Open Source |
| **Deployment** | Vercel (Hobby Tier) | Hobby plan limits apply |

---

## Getting Started

### 1. Prerequisites
- Node.js >= 20.9.0 (check current dependency requirements)
- A free [Clerk](https://clerk.com) account
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- A free [Uploadthing](https://uploadthing.com) account

### 2. Clone & Install

```bash
git clone https://github.com/lodaq/savvy.git
cd savvy
npm install
```

### 3. Environment Setup

Create `.env.local` (or copy the example if present):

```bash
touch .env.local
```

Fill in your secrets:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# MongoDB Atlas
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/savvy?retryWrites=true&w=majority

# Uploadthing
UPLOADTHING_TOKEN=your_uploadthing_token
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

### MagicLamp integration

Savvy already exposes read-only, user-scoped JSON APIs for the portfolio.
Create an API key in Savvy's **Settings / API** while signed in as the content
owner. Set these **server-only** variables in MagicLamp:

```env
SAVVY_API_URL=https://your-savvy-host.example/api/v1
SAVVY_API_KEY=<key generated in Savvy Settings / API>
REVALIDATE_SECRET=<shared refresh secret>
```

Set the corresponding refresh configuration in Savvy:

```env
PORTFOLIO_URL=https://your-portfolio-host.example
PORTFOLIO_REVALIDATE_SECRET=<same value as MagicLamp REVALIDATE_SECRET>
```

Use separate local ports, for example Savvy on 3000 and MagicLamp on 3001.
Then use `http://localhost:3000/api/v1` as `SAVVY_API_URL` and
`http://localhost:3001` as `PORTFOLIO_URL`. Production URLs must be reachable
from the other application's server. Restart/redeploy after setting variables.
Keep both secrets out of browser code and `NEXT_PUBLIC_*` variables.

Requests accept `Authorization: Bearer <key>` or `x-api-key: <key>`.
Responses are plain JSON arrays, except article detail which is an object:

| Endpoint under `/api/v1` | Content | Current list limit |
| --- | --- | --- |
| `/articles` | Published article metadata, newest first; optional `type` filter | Default 100, maximum 500 |
| `/articles?featured=true` | Published featured metadata, ordered by featured rank | Default 100, maximum 500 |
| `/articles/<slug>` | Published article including raw MDX `content`; 404 if absent/draft | Single article |
| `/shares` | Owner's shares, including `type`, type-specific fields, and `createdAt` | Default 100, maximum 500 |
| `/gallery` | Owner's image URLs and metadata | Default 200, maximum 500 |

All endpoints require a valid API key and select that key owner's content.
API responses use `private, no-store`; MagicLamp manages its own server-side
fetch cache and tags. Article create/edit/delete/import and share mutations
notify `POST /api/revalidate` with `x-revalidate-secret` and `{ "slug": "..." }`
for articles, or `{}` for shares. Refresh calls time out after five seconds;
failure is logged without undoing the saved content. Without working refresh
configuration, MagicLamp falls back to its normal cache expiry.

Known integration follow-ups tracked by the MagicLamp audit: the API has **no
pagination**, so `limit=500` is still a cap, not a complete collection read;
the producer and consumer need a coordinated pagination change. MagicLamp's
local MDX fallback can also restore a deleted/unpublished migrated slug, and
its link-card images need rendering fixes. These portfolio behaviors are not
fixed by configuring the API.

Focused CMS regression checks (Node 22.13+):

```bash
node --experimental-vm-modules --test scripts/test-cms-integration.mjs
```

The checks execute the route/action/helper code with database, authentication,
and HTTP boundaries stubbed; they do not require production credentials.

```
savvy/
├── actions/                  # Server Actions (mutations & data access)
│   ├── shares.ts             # Feed post CRUD, likes & OpenGraph scraping
│   ├── articles.ts           # MDX article CRUD & slug management
│   └── gallery.ts            # Media gallery CRUD & Uploadthing sync
├── app/
│   ├── layout.tsx            # Root layout (ClerkProvider, sonner Toaster)
│   ├── page.tsx              # Landing page
│   ├── globals.css           # Tailwind + shadcn CSS variable theme
│   ├── (auth)/               # Clerk SignIn / SignUp routes
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (dashboard)/          # Authenticated app shell
│   │   ├── layout.tsx        # Persistent sidebar layout
│   │   ├── feed/page.tsx     # Polymorphic content feed
│   │   ├── articles/         # MDX articles list, viewer & editor
│   │   └── gallery/page.tsx  # Image gallery with masonry grid
│   └── api/
│       ├── uploadthing/      # Uploadthing file router & endpoint
│       └── shares/           # REST endpoints for posts
├── components/
│   ├── ui/                   # Shadcn UI primitives (button, dialog, card...)
│   ├── sidebar.tsx           # Collapsible responsive navigation
│   ├── feed/                 # Post card wrappers & content embeds
│   ├── mdx/                  # Custom MDX components & server renderer
│   ├── editor/               # In-browser MDX editor (ssr: false)
│   └── gallery/              # Upload buttons & masonry layout
├── lib/
│   ├── mongodb.ts            # Cached Mongoose connection helper
│   ├── uploadthing.ts        # Uploadthing React client helpers
│   ├── utils.ts              # cn(), formatDate(), detectLanguage()
│   └── validators.ts         # Zod schemas for validation
├── models/                   # Mongoose database models
│   ├── share.ts              # Polymorphic shares (discriminator pattern)
│   ├── article.ts            # MDX articles schema
│   └── gallery-image.ts      # Cloud image metadata schema
├── proxy.ts                  # Clerk request integration
├── next.config.ts            # Next.js configuration
├── tailwind.config.ts        # Tailwind configuration
└── tsconfig.json             # TypeScript configuration
```

---

## Available Scripts

- `npm run dev` — Starts Next.js development server with Turbopack.
- `npm run build` — Builds the optimized production application.
- `npm run start` — Starts the production server.
- `npm run lint` — Runs ESLint checks.

---

## License

ISC
