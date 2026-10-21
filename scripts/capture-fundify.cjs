// Capture Fundify's live landing on a phone — the page visitors reach from the
// companion card at the foot of the Kikao chapter. Its public face, not a demo:
// the live directory only lists verified fundis, so we don't show sample ones.
//   NODE_PATH=/path/to/node_modules node scripts/capture-fundify.cjs
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const URL = 'https://dhamana-olive.vercel.app/';
const OUT = path.join(__dirname, '..', 'public', 'shots');

(async () => {
  const browser = await chromium.launch();
  const enc = await (await browser.newContext()).newPage();
  await enc.goto('about:blank');

  // 393×852 exactly — must match the CSS phone frame's aspect ratio
  const page = await (await browser.newContext({
    viewport: { width: 393, height: 852 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true,
  })).newPage();
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
  await page.addStyleTag({ content: '*{animation:none!important;transition:none!important}' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1200);
  const jpeg = await page.screenshot({ type: 'jpeg', quality: 92 });

  const dataUrl = await enc.evaluate(async (b64) => {
    const bmp = await createImageBitmap(await (await fetch('data:image/jpeg;base64,' + b64)).blob());
    const c = document.createElement('canvas');
    c.width = bmp.width; c.height = bmp.height;
    c.getContext('2d').drawImage(bmp, 0, 0);
    return c.toDataURL('image/webp', 0.82);
  }, jpeg.toString('base64'));
  fs.writeFileSync(path.join(OUT, 'fundify-mobile.webp'), Buffer.from(dataUrl.split(',')[1], 'base64'));
  console.log('saved fundify-mobile.webp');
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
