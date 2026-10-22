// Run: node tests/qa.cjs. Uses Playwright and Chromium from the prepared environment.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { execFileSync, execFile } = require('node:child_process');
const { promisify } = require('node:util');
const { createHash } = require('node:crypto');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const reference = JSON.parse(fs.readFileSync(path.join(root, 'docs/reference/finishes-reference.json')));
const baseline = execFileSync('git', ['show', 'd01a4d0:index.html'], { cwd: root, maxBuffer: 10e6 }).toString();
const current = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const output = process.env.FERN_QA_OUTPUT || '/tmp/fern-qa';
fs.mkdirSync(output, { recursive: true });
const normalize = s => s.replace(/\s+/g, ' ').trim();

async function run() {
  const checksums = JSON.parse(fs.readFileSync(path.join(root, 'docs/reference/source-checksums.json')));
  for (const [filename, expected] of Object.entries(checksums)) assert.equal(createHash('sha256').update(fs.readFileSync(path.join(root, 'assets', filename))).digest('hex'), expected, `Supplied asset must be byte-identical: ${filename}`);
  const disclaimer = normalize(fs.readFileSync(path.join(root, 'docs/reference/finishes-extracted.txt'), 'utf8').split('PLEASE NOTE')[1].split('DESIGNED & BUILT BY')[0]);
  // Protect complete plan markup, source images, captions, tables, and interaction code.
  const floorplans = s => s.split('<!-- FLOORPLANS -->')[1].split('<!-- COMPARABLE SALES -->')[0];
  assert.equal(floorplans(current), floorplans(baseline), 'Published floorplans and area tables must remain byte-identical');
  assert.equal(current.split('<script>')[1].split('</script>')[0], baseline.split('<script>')[1].split('</script>')[0], 'Existing floorplan interaction must be preserved');
  const server = http.createServer((req, res) => {
    if (req.url === '/__baseline') return res.end(baseline);
    const filename = path.resolve(root, '.' + decodeURIComponent(req.url.split('?')[0] === '/' ? '/index.html' : req.url.split('?')[0]));
    if (!filename.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
    try {
      const data = fs.readFileSync(filename);
      res.setHeader('Content-Type', filename.endsWith('.html') ? 'text/html; charset=utf-8' : filename.endsWith('.jpg') ? 'image/jpeg' : 'application/pdf');
      res.end(data);
    } catch { res.writeHead(404); res.end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
  const results = [];
  const fontCache = new Map();
  try {
    for (const width of (process.env.FERN_QA_WIDTHS ? process.env.FERN_QA_WIDTHS.split(',').map(Number) : [1440, 1920, 768, 1024, 375, 430])) {
      const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
      // Chromium lacks this cloud proxy's CA in its own trust store. curl uses the
      // system trust configuration and verifies TLS; never ignore browser HTTPS errors.
      await context.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//, async route => {
        const fontUrl = route.request().url();
        if (!fontCache.has(fontUrl)) fontCache.set(fontUrl, promisify(execFile)('curl', ['--fail', '--silent', '--show-error', '--location', '--max-time', '30', fontUrl], {encoding:'buffer', maxBuffer:10e6}));
        const {stdout} = await fontCache.get(fontUrl);
        await route.fulfill({status:200, contentType:fontUrl.includes('fonts.googleapis.com') ? 'text/css' : 'font/ttf', body:stdout});
      });
      const before = await context.newPage();
      const page = await context.newPage();
      const errors = [], failedRequests = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('requestfailed', r => failedRequests.push({ url: r.url(), error: r.failure()?.errorText }));
      await before.goto(url + '/__baseline', { waitUntil: 'networkidle' });
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator('img.shore-logo').count(), 1, 'Official supplied SHORE artwork must replace the text approximation');
      assert.equal(await page.locator('#materials details').count(), 11, 'All eleven schedule categories must be accessible');
      assert.equal(normalize(await page.locator('.schedule-note').innerText()), disclaimer, 'Exact builder disclaimer must remain accessible');
      const summaries = await page.locator('#materials summary').allTextContents();
      for (const [i, category] of reference.entries()) {
        assert.ok(normalize(summaries[i]).includes(category.title), `Category ${category.number}`);
        const detail = page.locator('#materials details').nth(i);
        const closedHeight = await detail.evaluate(e => e.getBoundingClientRect().height);
        await detail.locator('summary').focus();
        await page.keyboard.press('Enter');
        assert.equal(await detail.getAttribute('open'), '', 'Specification must open with keyboard');
        assert.ok(await detail.evaluate(e => e.getBoundingClientRect().height) > closedHeight);
        const text = normalize(await detail.innerText());
        for (const item of category.items) assert.ok(text.includes(normalize(item.description)), `Missing PDF inclusion: ${category.title}: ${item.label}`);
        const rows = await detail.locator('.finish-row').evaluateAll(rows => rows.map(r => ({label:r.querySelector('dt').textContent.trim(), description:r.querySelector('dd').textContent.trim()})));
        assert.deepEqual(rows, category.items, 'Every specification label must remain paired with its exact PDF description');
        await detail.locator('summary').click();
      }
      const images = await page.evaluate(async () => {
        await Promise.all([...document.images].map(i => i.decode()));
        const image = new Image(); image.src = getComputedStyle(document.querySelector('.cover-bg')).backgroundImage.slice(5, -2); await image.decode();
        return [...document.images].map(i => ({ alt: i.alt, src: i.getAttribute('src'), width: i.naturalWidth }));
      });
      const originalImages = await before.locator('img').evaluateAll(imgs => imgs.map(i => ({alt:i.alt, src:i.getAttribute('src')})));
      for (const image of originalImages) assert.ok(images.some(i => i.alt === image.alt && i.src === image.src), `Original image preserved: ${image.alt}`);
      assert.equal(await page.locator('.cover-stat-value').last().innerText(), 'Q1 2027');
      assert.ok((await page.locator('.cover').innerText()).includes('FERN'));
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `Horizontal overflow at ${width}`);
      const contrast = await page.locator('#materials .eyebrow, .finish-number, .finish-row dt, .schedule-note').evaluateAll(elements => elements.map(e => {
        const rgb = getComputedStyle(e).color.match(/[\d.]+/g).slice(0,3).map(Number).map(c => {c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;});
        return 1.05 / (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2] + 0.05);
      }));
      assert.ok(contrast.every(ratio => ratio >= 4.5), 'New schedule small text must meet WCAG AA contrast on white');
      assert.equal(await page.locator('.gallery-entry-dining').evaluate(e => [...e.querySelectorAll('img')].every(i => Math.abs(i.width / i.height - i.naturalWidth / i.naturalHeight) < 0.005 && i.getBoundingClientRect().bottom <= e.getBoundingClientRect().bottom + 1)), true, 'Entry and Dining must be uncropped, unstretched and contained');
      const links = await page.locator('a').evaluateAll(as => as.map(a => a.getAttribute('href')));
      const oldLinks = await before.locator('a').evaluateAll(as => as.map(a => a.getAttribute('href')));
      for (const link of oldLinks) assert.ok(links.includes(link), `Existing contact/navigation link: ${link}`);
      assert.ok(links.includes('tel:0431179861'));
      assert.ok(links.includes('mailto:chrislewis@stonerealestate.com.au'));
      const pdf = await page.request.get(url + '/assets/fern-finishes-inclusions.pdf');
      assert.equal(pdf.status(), 200); assert.ok((await pdf.body()).subarray(0,4).equals(Buffer.from('%PDF')));
      for (const [i, id] of ['basement', 'ground', 'first'].entries()) {
        await page.locator('.fp-tab').nth(i).click();
        assert.equal(await page.locator('.fp-panel.active').getAttribute('id'), 'fp-' + id);
        assert.equal(await page.locator('.fp-panel:visible').count(), 1);
      }
      await page.locator('.fp-tab').first().click();
      // Compare rendered pixels for every original gallery left outside the framing change,
      // the complete plans, comparable sales, location and agency/footer sections.
      let unchanged = 0;
      const alignedScreenshot = async locator => {
        // Isolate preserved sections at the same integer origin and original width.
        // Normal page screenshots below still capture actual flow and overlap.
        const style = await locator.getAttribute('style');
        await locator.evaluate(e => { const r = e.getBoundingClientRect(); Object.assign(e.style, { position:'absolute', top:'0', left:`${r.x}px`, width:`${r.width}px`, height:`${Math.floor(r.height)}px`, overflow:'hidden', margin:'0', zIndex:'2147483647' }); });
        const capture = await locator.screenshot({ animations: 'disabled' });
        await locator.evaluate((e, style) => { if (style === null) e.removeAttribute('style'); else e.setAttribute('style', style); }, style);
        return capture;
      };
      for (const selector of ['.gallery-hero', '.gallery-2-equal', '.gallery-bed-hero', '.gallery-2-pow-ens', 'section:has(.fp-tab-bar)', 'section:has(.comp-grid)', 'section:has(.location-grid)', '.footer-top', '.footer-disclaimer']) {
        const originalBox = await before.locator(selector).boundingBox(), currentBox = await page.locator(selector).boundingBox();
        assert.equal(currentBox.width, originalBox.width, `Preserved section width: ${selector}`);
        assert.equal(currentBox.height, originalBox.height, `Preserved section height: ${selector}`);
        const a = await alignedScreenshot(before.locator(selector));
        const b = await alignedScreenshot(page.locator(selector));
        if (!a.equals(b)) {
          fs.writeFileSync(path.join(output, `difference-${width}-before.png`), a);
          fs.writeFileSync(path.join(output, `difference-${width}-after.png`), b);
          console.log('Visual difference diagnostics', selector, await before.locator(selector).boundingBox(), await page.locator(selector).boundingBox());
        }
        assert.ok(a.equals(b), `Visual regression in preserved ${selector} at ${width}`);
        unchanged++;
      }
      for (const [name, target] of [['before', before], ['after', page]]) {
        await target.locator('.gallery-entry-dining').screenshot({path:path.join(output, `framing-${width}-${name}.png`)});
        await target.screenshot({path:path.join(output, `page-${width}-${name}.png`), fullPage:true});
      }
      await page.locator('#materials').screenshot({path:path.join(output, `materials-${width}.png`)});
      await page.locator('.partner-grid').screenshot({path:path.join(output, `partners-${width}.png`)});
      assert.deepEqual(errors, [], 'No JavaScript errors');
      assert.deepEqual(failedRequests.filter(r => !/fonts\.(googleapis|gstatic)\.com/.test(r.url)), [], 'No failed application asset requests');
      const metrics = await page.evaluate(() => ({fontLoaded:[...document.fonts].some(f => f.family === 'Poppins' && f.status === 'loaded'), domElements:document.querySelectorAll('*').length, loadMs:performance.getEntriesByType('navigation')[0].loadEventEnd}));
      assert.equal(metrics.fontLoaded, true, 'Real Poppins font faces must load through verified TLS');
      results.push({width, status:'passed', categories:reference.length, inclusions:reference.reduce((n,c)=>n+c.items.length,0), images:images.length, unchangedSections:unchanged, errors, failedRequests, ...metrics});
      console.log(JSON.stringify(results.at(-1)));
      if (width === 1440) {
        await page.emulateMedia({media:'print'});
        assert.equal(await page.locator('#materials dd:visible').count(), reference.reduce((n,c)=>n+c.items.length,0), 'Print must expose all collapsed schedule content');
        await page.pdf({path:path.join(output,'print.pdf'),format:'A4',printBackground:true});
        const printedText = normalize(execFileSync('pdftotext', ['-layout', path.join(output,'print.pdf'), '-']).toString());
        for (const category of reference) for (const item of category.items) assert.ok(printedText.includes(item.description), `Printed schedule inclusion: ${category.title}: ${item.label}`);
      }
      await context.close();
    }
    fs.writeFileSync(path.join(output,'results.json'), JSON.stringify(results,null,2));
  } finally { await browser.close(); server.close(); }
}
run().catch(e => { console.error(e); process.exitCode = 1; });
