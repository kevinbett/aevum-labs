// Capture the REAL Sampuli app (fully client-side; every value is synthetic).
//   NODE_PATH=/path/to/node_modules node scripts/capture-sampuli-demo.cjs
const { chromium, devices } = require('playwright');
const path = require('path');
const fs = require('fs');
const OUT = path.join(__dirname, '..', 'public', 'shots');

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ...devices['iPhone 14 Pro'], viewport: { width: 393, height: 852 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();

  const save = async (name) => {
    const buf = await page.screenshot({ type: 'jpeg', quality: 90 });
    const b64 = buf.toString('base64');
    const dataUrl = await page.evaluate(async (b64) => {
      const blob = await (await fetch('data:image/jpeg;base64,' + b64)).blob();
      const bmp = await createImageBitmap(blob);
      const c = document.createElement('canvas');
      c.width = bmp.width; c.height = bmp.height;
      c.getContext('2d').drawImage(bmp, 0, 0);
      return c.toDataURL('image/webp', 0.82);
    }, b64);
    fs.writeFileSync(path.join(OUT, name), Buffer.from(dataUrl.split(',')[1], 'base64'));
    console.log('saved', name);
  };
  const clickText = (re, scope) => page.evaluate(({ src, scope }) => {
    const re = new RegExp(src, 'i');
    const els = [...document.querySelectorAll(scope || 'a,button')];
    const el = els.find((e) => re.test(e.textContent.trim()));
    if (!el) throw new Error('not found: ' + src);
    el.click();
  }, { src: re.source, scope });

  await page.goto('https://sampuli.site', { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(2500);
  await save('sampuli-app-1.webp'); // quick strip — one value, one click

  // "Start with a suggested set" turns on 8 fields — the batch table
  // populates instantly (the button then reads "Regenerate")
  await page.evaluate(() => {
    const el = [...document.querySelectorAll('button')].find((e) => /suggested/i.test(e.textContent.trim()));
    if (el) el.click();
  });
  await page.waitForTimeout(1800);
  await page.evaluate(() => {
    const t = document.querySelector('table');
    if (t) { t.scrollIntoView({ block: 'start' }); scrollBy(0, -64); }
  });
  await page.waitForTimeout(600);
  await save('sampuli-app-2.webp'); // the generated batch (100 records)

  // Datasets view — the tab pills are .view-btn buttons
  await page.evaluate(() => {
    const el = [...document.querySelectorAll('button.view-btn, button')].find((e) => /^Datasets$/i.test(e.textContent.trim()));
    if (el) el.click();
  });
  await page.waitForTimeout(2500);
  await page.evaluate(() => {
    const h = [...document.querySelectorAll('h2,h3')].find((e) => /relational datasets/i.test(e.textContent));
    if (h) { h.scrollIntoView({ block: 'start' }); scrollBy(0, -64); }
  });
  await page.waitForTimeout(600);
  await save('sampuli-app-3.webp'); // relational datasets

  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
