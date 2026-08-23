# Blues-berry Portfolio Hub

A bilingual portfolio for projects spanning remote physiology, computer vision,
and in-browser machine learning.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Configuration

Copy `.env.example` to `.env.local` when you need to override production URLs:

```dotenv
NEXT_PUBLIC_SITE_URL=https://chexueyuan.vercel.app
NEXT_PUBLIC_OPEN_RPPG_URL=https://open-rppg-nu.vercel.app
```

All public profile and project copy lives in `lib/content.ts`. Shared public URLs
live in `lib/site.ts`.

## GitHub project sync

The project registry lives in `lib/projects.ts`. Add a project there once, with
its GitHub `owner/repository`, status, localized title/description, and optional
demo or case-study URL. Repository metadata is fetched server-side from the
GitHub API and cached for one hour, with local content used as a safe fallback.

To refresh the site immediately after a subproject changes:

1. Add `GITHUB_WEBHOOK_SECRET` to the website's Vercel environment variables.
2. In each GitHub repository, add a Webhook pointing to
   `https://<your-domain>/api/github/webhook`.
3. Choose `application/json`, the same secret, and subscribe to `Push` events.

The webhook invalidates the portfolio cache, so the next request reads the
latest GitHub data. `GITHUB_TOKEN` is optional but recommended for larger
projects or many repositories. `SYNC_SECRET` also enables a protected manual
refresh with `POST /api/github/sync` and `Authorization: Bearer <SYNC_SECRET>`.

New repositories still need one registry entry because GitHub cannot infer the
portfolio's localized copy, route, visual treatment, or demo URL reliably.

## Routes

- `/` — Chinese portfolio
- `/en` — English portfolio
- `/projects/game-demos` — interactive game demo directory
- `/projects/game-demos/office-cringe` — Office Cringe Simulator
- `/projects/game-demos/beyond-the-rules` — Beyond the Rules
- `/projects/qifei` — Protocol: Endgame project preview
- `/projects/fde` — Amazon FDE operations radar preview
- The Open-rPPG project card opens the live experience directly at
  `https://open-rppg-nu.vercel.app/#experience`.
- Legacy `/projects/open-rppg` routes redirect to the live experience and are
  intentionally excluded from the sitemap.

## Deploy to Vercel

1. Import this repository into Vercel.
2. Use the **Next.js** framework preset and root directory `./`.
3. Keep `NEXT_PUBLIC_SITE_URL` aligned with the final production URL.
4. Keep `NEXT_PUBLIC_OPEN_RPPG_URL` set to `https://open-rppg-nu.vercel.app`.
5. Use the `main` branch for Production.
6. Keep the production domain public. Standard Deployment Protection can remain
   enabled for preview and generated deployment URLs.
