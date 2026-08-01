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

## Routes

- `/` — Chinese portfolio
- `/en` — English portfolio
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
