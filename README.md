# Aevum Labs

The single entry point to an independent product studio — a showcase of the products
built under Aevum Labs, made to reach the public, partners and investors.

*Aevum* is Latin for a lifetime, an age. The studio builds to that horizon: durable,
dependable software, engineered to endure rather than just to launch.

**Live products:**

- [Zaamu](https://zaamu.com) — booking platform for barbershops, salons and spas (multi-tenant SaaS).
- [PesaScope](https://pesascope.site) — privacy-first M-Pesa statement analyzer (100% client-side).
- [Sampuli](https://sampuli.site) — synthetic test-data generator, 27 country packs.
- [Mezani](https://mezani.health) — calm, pantry-aware meal planner for households.

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
- **Contact** — `CONTACT_EMAIL` at the top of the file.
- **Studio name** — search `Aevum` in `src/App.jsx`, `index.html` and `public/og.svg` to rename.

The logomark (concentric growth rings — age rings, a mark of longevity) is
`public/favicon.svg`; the social card is `public/og.jpg` (1200×630, referenced by
absolute URL in `index.html` — update that URL when the domain changes).

**Product screenshots** ship as WebP in `public/shots/` (`<product>-desktop-1440/2880.webp`
via `srcset`, `<product>-mobile.webp` at 393×852 @2x — the mobile size must match the CSS
phone frame's aspect ratio or the image gets cropped). When a product's landing page
changes materially:

```bash
node scripts/capture-shots.cjs        # landing-page JPG intermediates (Playwright via NODE_PATH)
node scripts/capture-booking.cjs      # real Zaamu booking journey (test tenant, read-only)
node scripts/capture-mezani-demo.cjs  # real Mezani app via its public guest demo
npm run dev                      # make-assets encodes through the dev server
node scripts/make-assets.cjs     # WebP files + og.jpg
```
