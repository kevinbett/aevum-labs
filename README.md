# Rift Foundry

The single entry point to an independent product studio — a showcase of the products
forged under Rift Foundry, built to reach the public, partners and investors.

**Live products:**

- [Zaamu](https://zaamu.com) — booking platform for barbershops, salons and spas (multi-tenant SaaS).
- [PesaScope](https://pesascope.site) — privacy-first M-Pesa statement analyzer (100% client-side).
- [Sampuli](https://sampuli.site) — synthetic test-data generator, 27 country packs.

## Stack

React 18 + Vite 5. No CSS framework — handcrafted CSS in `src/styles.css`. Fonts:
Fraunces (editorial display) + Plus Jakarta Sans (UI).

## Run it

```bash
npm install
npm run dev        # local dev server
npm run build      # production build in dist/
npm run preview    # serve the production build locally
```

The `dist/` output is fully static — deploy it to Vercel, Netlify, or any static host.

## Deploy (Vercel)

`vercel.json` is set up (Vite preset, security headers, asset caching).

```bash
npx vercel          # first deploy — link/create the project
npx vercel --prod   # production
```

## Editing content

Everything lives in `src/App.jsx`:

- **Products** — the `PROJECTS` array (name, tagline, description, stack, accent colour, live URL).
- **Studio principles** — the `PRINCIPLES` array.
- **Stats band** — the `STATS` array.
- **Contact** — `CONTACT_EMAIL` and `GITHUB_URL` at the top of the file.

The logomark is `public/favicon.svg`; the social card is `public/og.svg`.

> Note: `og.svg` is a placeholder. Some social scrapers don't render SVG — once a
> domain is set, export a 1200×630 **PNG** and point the absolute `og:image` URL in
> `index.html` at it for reliable link previews.
