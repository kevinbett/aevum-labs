// Capture the REAL Kikao app — office Overview (laptop), field "Today" (phone)
// and the decision journey (queue → request → approved & sealing) — from its
// built-in demo mode: a seeded sample company, nobody's real data.
//
// The live app (kikao.site) sits behind sign-in, so run the Kikao repo's own
// dev server in mock mode (no VITE_USE_SUPABASE) from a throwaway worktree.
// This site keeps the founder anonymous, so before capturing, rename the demo
// seed's sample company and director to neutral names in that throwaway
// worktree (never commit it). Then start it:
//
//   git -C contractor-approvals worktree add --detach /tmp/kikao-capture origin/main
//   ln -s "$PWD/contractor-approvals/node_modules" /tmp/kikao-capture/node_modules
//   npx vite --port 5199 --strictPort --host 127.0.0.1
//
// Then:  KIKAO=http://127.0.0.1:5199 NODE_PATH=/path/to/node_modules node scripts/capture-kikao-demo.cjs
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE = process.env.KIKAO || 'http://127.0.0.1:5199';
const OUT = path.join(__dirname, '..', 'public', 'shots');
const CALM = '*{animation:none!important;transition:none!important;caret-color:transparent!important}';

(async () => {
  const browser = await chromium.launch();

  // WebP encoding happens in a blank page so it never depends on the app's CSP
  const enc = await (await browser.newContext()).newPage();
  await enc.goto('about:blank');
  const toWebp = async (jpeg, width, quality) => {
    const dataUrl = await enc.evaluate(async ({ b64, width, quality }) => {
      const bmp = await createImageBitmap(await (await fetch('data:image/jpeg;base64,' + b64)).blob());
      const w = width || bmp.width;
      const c = document.createElement('canvas');
      c.width = w; c.height = Math.round(bmp.height * (w / bmp.width));
      c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
      return c.toDataURL('image/webp', quality);
    }, { b64: jpeg.toString('base64'), width, quality });
    return Buffer.from(dataUrl.split(',')[1], 'base64');
  };
  const settle = async (page) => {
    await page.addStyleTag({ content: CALM });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(900);
  };

  // Laptop: the office Overview at 1440×900 (@2x → 2880w for retina)
  const desk = await (await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })).newPage();
  await desk.goto(`${BASE}/o`, { waitUntil: 'networkidle' });
  await settle(desk);
  const dj = await desk.screenshot({ type: 'jpeg', quality: 90 });
  fs.writeFileSync(path.join(OUT, 'kikao-desktop.jpg'), dj); // intermediate, gitignored
  fs.writeFileSync(path.join(OUT, 'kikao-desktop-1440.webp'), await toWebp(dj, 1440, 0.82));
  fs.writeFileSync(path.join(OUT, 'kikao-desktop-2880.webp'), await toWebp(dj, null, 0.78));
  console.log('saved kikao-desktop');

  // Phone: 393×852 exactly — must match the CSS phone frame's aspect ratio
  const phone = await (await browser.newContext({
    viewport: { width: 393, height: 852 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true,
  })).newPage();
  const shot = async (name) => {
    fs.writeFileSync(path.join(OUT, name), await toWebp(await phone.screenshot({ type: 'jpeg', quality: 92 }), null, 0.82));
    console.log('saved', name);
  };

  await phone.goto(`${BASE}/m`, { waitUntil: 'networkidle' });
  await settle(phone);
  await shot('kikao-mobile.webp'); // field "Today" — with the offline queue chip

  // The mock keeps its state in memory, so the journey is walked in-app
  await phone.goto(`${BASE}/m/todo`, { waitUntil: 'networkidle' });
  await settle(phone);
  await shot('kikao-app-1.webp'); // 1 · one queue for every decision

  await phone.getByText(/Kitengela Hardware/).first().click();
  await phone.waitForURL(/\/m\/requests\//);
  await settle(phone);
  await shot('kikao-app-2.webp'); // 2 · the decision: chain, three-way match, evidence

  await phone.getByRole('button', { name: /^Approve KSh/ }).first().click();
  await settle(phone);
  await shot('kikao-app-3.webp'); // 3 · approved — sealing into the record, undo for 10 s

  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
