// Capture the REAL PesaScope experience via its built-in sample statement
// ("Explore with a sample statement") — seeded data, nobody's real money.
//   NODE_PATH=/path/to/node_modules node scripts/capture-pesascope-demo.cjs
const { chromium, devices } = require('playwright');
const path = require('path');
const fs = require('fs');
const OUT = path.join(__dirname, '..', 'public', 'shots');

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ...devices['iPhone 14 Pro'], viewport: { width: 393, height: 852 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  // PesaScope ships a strict CSP that blocks data: fetches, so WebP encoding
  // happens in a separate blank page rather than inside the app itself.
  const enc = await ctx.newPage();
  await enc.goto('about:blank');

  const save = async (name) => {
    const buf = await page.screenshot({ type: 'jpeg', quality: 90 });
    const b64 = buf.toString('base64');
    const dataUrl = await enc.evaluate(async (b64) => {
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
  const clickText = (re) => page.evaluate((src) => {
    const re = new RegExp(src, 'i');
    const el = [...document.querySelectorAll('a,button')].find((e) => re.test(e.textContent.trim()));
    if (!el) throw new Error('not found: ' + src);
    el.click();
  }, re.source);

  await page.goto('https://pesascope.site', { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(2500);
  await save('pesascope-app-1.webp'); // the drop screen — the privacy promise

  await clickText(/sample statement/);
  await page.waitForTimeout(6000); // parse + render the sample

  // React re-renders restore the "Sample data" banner, so hide it before every frame
  const hideBanner = () => page.evaluate(() => {
    const hits = [...document.querySelectorAll('div,section,aside')].filter((d) => /Sample data\s*—\s*not your statement/i.test(d.textContent));
    const inner = hits[hits.length - 1];
    if (inner) inner.style.display = 'none';
  });

  // frame the overview from the section chips down: stat tiles + "Where the money went"
  await hideBanner();
  await page.evaluate(() => {
    const chip = [...document.querySelectorAll('a,button')].find((e) => /^Overview$/i.test(e.textContent.trim()));
    if (chip) { chip.scrollIntoView({ block: 'start' }); scrollBy(0, -70); }
  });
  await page.waitForTimeout(700);
  await save('pesascope-app-2.webp'); // money in/out, net, Fuliza, category bars

  // deeper: the money-flow / transactions area
  await page.evaluate(() => {
    const h = [...document.querySelectorAll('h1,h2,h3')].find((e) => /money flow/i.test(e.textContent));
    if (h) { h.scrollIntoView({ block: 'start' }); scrollBy(0, -170); } // clear the sticky sample banner
  });
  await hideBanner();
  await page.waitForTimeout(700);
  await save('pesascope-app-3.webp'); // money flow + transactions

  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
