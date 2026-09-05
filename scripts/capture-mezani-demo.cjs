// Capture the REAL Mezani app via its public guest demo ("Take a look inside")
// — seeded demo data, nobody's personal information. Read-only.
//   NODE_PATH=/path/to/node_modules node scripts/capture-mezani-demo.cjs
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
  const clickText = (re) => page.evaluate((src) => {
    const re = new RegExp(src, 'i');
    const el = [...document.querySelectorAll('a,button')].find((e) => re.test(e.textContent));
    if (!el) throw new Error('not found: ' + src);
    el.click();
  }, re.source);

  await page.goto('https://mezani.health', { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(3000);
  await clickText(/take a look inside/);
  await page.waitForTimeout(4000);
  // hide the "You're previewing" banner for clean frames
  await page.evaluate(() => {
    const all = [...document.querySelectorAll('div,section,aside')];
    const banners = all.filter((d) => /previewing Mezani/i.test(d.textContent));
    const inner = banners[banners.length - 1]; // deepest match wraps just the banner
    if (inner) inner.style.display = 'none';
  });
  await page.waitForTimeout(800);
  await save('mezani-app-1.webp'); // This Week

  await clickText(/^Shopping$/);
  await page.waitForTimeout(2000);
  await save('mezani-app-2.webp'); // Shopping list

  await clickText(/^Pantry$/);
  await page.waitForTimeout(2000);
  await save('mezani-app-3.webp'); // Pantry

  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
