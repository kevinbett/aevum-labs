// Convert captured JPGs to the WebP files the site serves, and refresh og.jpg.
// Requires the dev server running on :5186 (npm run dev) and Playwright:
//   NODE_PATH=/path/to/node_modules node scripts/make-assets.cjs
// The intermediate *.jpg files are not committed — only the WebP output is.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const SHOTS = path.join(__dirname, '..', 'public', 'shots');
const PUB = path.join(__dirname, '..', 'public');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5186', { waitUntil: 'networkidle' });

  const encode = async (file, width, quality) => {
    const b64 = fs.readFileSync(path.join(SHOTS, file)).toString('base64');
    const dataUrl = await page.evaluate(async ({ b64, width, quality }) => {
      const blob = await (await fetch('data:image/jpeg;base64,' + b64)).blob();
      const bmp = await createImageBitmap(blob);
      const w = width || bmp.width;
      const h = Math.round(bmp.height * (w / bmp.width));
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      c.getContext('2d').drawImage(bmp, 0, 0, w, h);
      return c.toDataURL('image/webp', quality);
    }, { b64, width, quality });
    return Buffer.from(dataUrl.split(',')[1], 'base64');
  };

  for (const id of ['zaamu', 'pesascope', 'sampuli', 'mezani']) {
    fs.writeFileSync(path.join(SHOTS, `${id}-desktop-1440.webp`), await encode(`${id}-desktop.jpg`, 1440, 0.82));
    fs.writeFileSync(path.join(SHOTS, `${id}-desktop-2880.webp`), await encode(`${id}-desktop.jpg`, null, 0.78));
    fs.writeFileSync(path.join(SHOTS, `${id}-mobile.webp`), await encode(`${id}-mobile.jpg`, null, 0.82));
    console.log('webp:', id);
  }

  // og.jpg — the hero, compacted to fit 1200x630
  const og = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await og.goto('http://localhost:5186', { waitUntil: 'networkidle' });
  await og.addStyleTag({ content: `
    .nav { display: none !important; }
    .hero { padding: 92px 22px 0 !important; height: 630px; }
    .hero-anim { animation: none !important; opacity: 1 !important; transform: none !important; filter: none !important; }
    .grad-hero { animation: none !important; }
  ` });
  await og.waitForTimeout(600);
  await og.screenshot({ path: path.join(PUB, 'og.jpg'), type: 'jpeg', quality: 88, clip: { x: 0, y: 0, width: 1200, height: 630 } });
  console.log('og.jpg captured');
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
