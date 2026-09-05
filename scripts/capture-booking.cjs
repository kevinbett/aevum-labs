// Capture the REAL Zaamu booking journey (three steps) from the prod test
// tenant Busy Cuts — read-only: we never submit the final form.
//   NODE_PATH=/path/to/node_modules node scripts/capture-booking.cjs
const { chromium, devices } = require('playwright');
const path = require('path');
const OUT = path.join(__dirname, '..', 'public', 'shots');

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ...devices['iPhone 14 Pro'], viewport: { width: 393, height: 852 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();

  const save = async (name) => {
    const buf = await page.screenshot({ type: 'jpeg', quality: 90 });
    // encode to webp in-page via canvas
    const b64 = buf.toString('base64');
    const dataUrl = await page.evaluate(async (b64) => {
      const blob = await (await fetch('data:image/jpeg;base64,' + b64)).blob();
      const bmp = await createImageBitmap(blob);
      const c = document.createElement('canvas');
      c.width = bmp.width; c.height = bmp.height;
      c.getContext('2d').drawImage(bmp, 0, 0);
      return c.toDataURL('image/webp', 0.82);
    }, b64);
    require('fs').writeFileSync(path.join(OUT, name), Buffer.from(dataUrl.split(',')[1], 'base64'));
    console.log('saved', name);
  };

  await page.goto('https://zaamu.com/book/busy-cuts', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2000);
  await save('zaamu-book-1.webp'); // step: pick a service

  // pick the first service card (rows show a KES price)
  const svc = page.locator('button, [role="button"], li, div').filter({ hasText: /KES\s?[\d,]+/ }).first();
  await svc.click();
  await page.waitForTimeout(2500);
  await save('zaamu-book-2.webp'); // step: staff + time

  // "Any available" auto-advances past the calendar to the details step
  await page.getByText('Any available').first().click({ timeout: 15000 });
  await page.waitForTimeout(2500);
  await save('zaamu-book-3.webp'); // step: your details — NOT submitted

  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
