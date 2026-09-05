// Recapture product screenshots (run when a product's landing page changes).
// Needs Playwright + Chromium on the PATH of some node_modules:
//   NODE_PATH=/path/to/node_modules node scripts/capture-shots.cjs
// Then run scripts/make-assets.cjs to produce the WebP files the site uses.
const { chromium, devices } = require('playwright');
const path = require('path');
const OUT = path.join(__dirname, '..', 'public', 'shots');
const SITES = [
  { id: 'zaamu', url: 'https://zaamu.com' },
  { id: 'pesascope', url: 'https://pesascope.site' },
  { id: 'sampuli', url: 'https://sampuli.site' },
  { id: 'mezani', url: 'https://mezani.health' },
];

(async () => {
  const browser = await chromium.launch();
  for (const s of SITES) {
    const dctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
    const dp = await dctx.newPage();
    await dp.goto(s.url, { waitUntil: 'networkidle', timeout: 60000 });
    await dp.waitForTimeout(2500);
    await dp.screenshot({ path: path.join(OUT, `${s.id}-desktop.jpg`), type: 'jpeg', quality: 86 });
    await dctx.close();

    // 393x852 exactly — must match the CSS phone frame's aspect ratio
    const mctx = await browser.newContext({ ...devices['iPhone 14 Pro'], viewport: { width: 393, height: 852 }, deviceScaleFactor: 2 });
    const mp = await mctx.newPage();
    await mp.goto(s.url, { waitUntil: 'networkidle', timeout: 60000 });
    await mp.waitForTimeout(2500);
    await mp.screenshot({ path: path.join(OUT, `${s.id}-mobile.jpg`), type: 'jpeg', quality: 86 });
    await mctx.close();
    console.log('captured', s.id);
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
