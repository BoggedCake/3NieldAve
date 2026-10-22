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
const baseline = execFileSync('git', ['show', 'bb4f7b1:index.html'], { cwd: root, maxBuffer: 10e6 }).toString();
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
    if (req.url === '/__standalone/preview.html') { res.setHeader('Content-Type', 'text/html; charset=utf-8'); return res.end(current); }
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
    for (const width of (process.env.FERN_QA_WIDTHS ? process.env.FERN_QA_WIDTHS.split(',').map(Number) : [375,390,430,768,1024,1440,1920,2560])) {
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
      await before.evaluate(() => {
        const first=document.querySelector('.gallery-hero'), wrapper=document.createElement('div');
        wrapper.className='baseline-gallery'; first.before(wrapper);
        for(const selector of ['.gallery-hero','.gallery-2-equal','.gallery-entry-dining','.gallery-bed-hero','.gallery-2-pow-ens']) wrapper.append(document.querySelector(selector));
      });
      await page.goto(url + '/__standalone/preview.html', { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      for(const selector of ['.body-copy','.feature-list','.data-table','.partner-desc','.footer-detail','.disclaimer-text','.schedule-note','.cover-stat-value','.stat-cell']) {
        assert.deepEqual((await page.locator(selector).allTextContents()).map(normalize),(await before.locator(selector).allTextContents()).map(normalize),`Approved commercial content: ${selector}`);
      }
      const portrait = page.locator('.footer-agent img.agent-headshot');
      assert.equal(await portrait.count(), 1, 'Chris Lewis portrait must be present inside his contact section');
      assert.equal(await portrait.isVisible(), true, 'Portrait must be visible');
      await portrait.scrollIntoViewIfNeeded();
      const headshot = await portrait.evaluate(async i => {
        await i.decode();
        const r = i.getBoundingClientRect(), details = document.querySelector('.footer-agent-copy').getBoundingClientRect(), footer = i.closest('.footer-top').getBoundingClientRect();
        const centre = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
        const label = document.querySelector('.footer-agent-copy .eyebrow').getBoundingClientRect();
        return {src:i.getAttribute('src'), alt:i.alt, decoded:i.complete && i.naturalWidth > 0, natural:[i.naturalWidth,i.naturalHeight], width:r.width,height:r.height, topAligned:Math.abs(r.top-label.top)<1, crop:getComputedStyle(i).objectFit, cropPosition:getComputedStyle(i).objectPosition, beside:r.right <= details.left, above:r.bottom <= details.top, contained:r.left >= footer.left && r.right <= footer.right && r.top >= footer.top && r.bottom <= footer.bottom, unobscured:centre === i};
      });
      assert.equal(headshot.decoded, true);
      assert.equal(headshot.unobscured, true, 'Portrait must not be covered by another element');
      assert.equal(headshot.contained, true);
      assert.equal(headshot.alt, 'Chris Lewis, Exclusive Agent');
      assert.deepEqual(headshot.natural, [840,1050]);
      assert.ok(headshot.src.startsWith('data:image/jpeg;base64,'), 'Portrait must survive HTML-only preview packaging');
      assert.equal(createHash('sha256').update(Buffer.from(headshot.src.split(',')[1],'base64')).digest('hex'), checksums['FERN_Chris_Lewis_Headshot_Web.jpg'], 'Embedded portrait must be the unchanged supplied web JPEG');
      assert.ok(Math.abs(headshot.width / headshot.height - 37/40) < 0.001, 'Use a restrained face-and-shoulders crop');
      assert.equal(headshot.crop, 'cover');
      assert.equal(headshot.cropPosition, '50% 0%');
      if (width >= 768) { assert.ok(headshot.width >= 180 && headshot.width <= 190); assert.equal(headshot.beside,true); assert.equal(headshot.topAligned,true,'Portrait top must align with EXCLUSIVE AGENT'); }
      else { assert.ok(headshot.width >= 120 && headshot.width <= 150); assert.equal(headshot.above,true); }
      assert.equal(await page.locator('img.shore-logo').count(), 1, 'Official supplied SHORE artwork must replace the text approximation');
      const logoSource = await page.locator('img.shore-logo').getAttribute('src');
      assert.ok(logoSource.startsWith('data:image/jpeg;base64,'), 'The exact logo must also work in HTML-only previews');
      assert.equal(createHash('sha256').update(Buffer.from(logoSource.split(',')[1], 'base64')).digest('hex'), checksums['shore-logo.jpg']);
      assert.equal(await page.locator('.shore-logo-panel .shore-logo').count(), 1, 'SHORE artwork must sit inside a deliberate inset panel');
      const brandPresentation = await page.evaluate(() => {
        const panel = document.querySelector('.shore-logo-panel'), logo = document.querySelector('.johinke-logo');
        return {panelBackground:getComputedStyle(panel).backgroundColor, panelPadding:parseFloat(getComputedStyle(panel).paddingLeft), tileBackground:getComputedStyle(panel.closest('.partner-card')).backgroundColor, johinkeFilter:getComputedStyle(logo).filter, johinkeVisibleWidth:document.querySelector('.johinke-mark').getBoundingClientRect().width};
      });
      assert.equal(brandPresentation.tileBackground, 'rgb(17, 17, 17)');
      assert.equal(brandPresentation.panelBackground, 'rgb(255, 255, 255)');
      assert.ok(brandPresentation.panelPadding >= 20, 'Inset panel needs intentional whitespace');
      assert.equal(brandPresentation.johinkeFilter, 'none', 'Original white Johinke artwork must remain legible');
      assert.ok(brandPresentation.johinkeVisibleWidth >= 240, 'Johinke lettering must remain prominent');
      assert.equal(await page.locator('#materials details').count(), 11, 'All eleven schedule categories must be accessible');
      const poolHeading = page.locator('.material-note h3', {hasText:'Landscaping & Pool'});
      assert.equal(await poolHeading.count(),1);
      assert.equal(await poolHeading.innerText(),'Landscaping & Pool');
      assert.equal(await poolHeading.locator('..').locator('p').innerText(),'Tumbled travertine, limestone paving and pool coping, landscaped gardens and private green-toned Ezarri glass mosaic pools.');
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
        document.querySelectorAll('img').forEach(i => {i.loading='eager';});
        await Promise.all([...document.images].map(i => i.decode()));
        const image = new Image(); image.src = getComputedStyle(document.querySelector('.cover-bg')).backgroundImage.slice(5, -2); await image.decode();
        return [...document.images].map(i => ({ alt: i.alt, src: i.getAttribute('src'), width: i.naturalWidth }));
      });
      const originalImages = await before.locator('img:not(.shore-logo)').evaluateAll(imgs => imgs.map(i => ({alt:i.alt, src:i.getAttribute('src')})));
      for (const image of originalImages) assert.ok(images.some(i => i.alt === image.alt && i.src === image.src), `Original image preserved: ${image.alt}`);
      assert.equal(await page.locator('.cover-stat-value').last().innerText(), 'Q2 2027');
      const bodyText = await page.locator('body').innerText();
      assert.equal((bodyText.match(/Q2 2027/g) || []).length, 3, 'Cover, summary and body must all use Q2 2027');
      assert.ok(!/Q1 2027|December 2026/.test(bodyText));
      assert.equal((bodyText.match(/\bshore\b/gi) || []).length, (bodyText.match(/\bSHORE Projects\b/g) || []).length, 'Every visible builder reference must read SHORE Projects');
      assert.ok((await page.locator('.cover').innerText()).includes('FERN'));
      assert.equal(await page.locator('.editorial-gallery').count(),1,'Gallery needs an editorial container');
      const architecture = await page.locator('.editorial-gallery img, .harbour-feature img').evaluateAll(imgs => imgs.map(i => {
        const r=i.getBoundingClientRect(), f=i.closest('figure').getBoundingClientRect();
        let clipped=false;
        for(let p=i.parentElement;p&&p!==document.body;p=p.parentElement){const style=getComputedStyle(p),b=p.getBoundingClientRect();if(/hidden|clip/.test(style.overflowX)&& (r.left<b.left-1||r.right>b.right+1))clipped=true;if(/hidden|clip/.test(style.overflowY)&&(r.top<b.top-1||r.bottom>b.bottom+1))clipped=true;}
        return {alt:i.alt, ratio:r.width/r.height, native:i.naturalWidth/i.naturalHeight, width:r.width, fit:getComputedStyle(i).objectFit,clipped,within:r.left>=f.left-1 && r.right<=f.right+1 && r.bottom<=f.bottom+1};
      }));
      assert.equal(architecture.length,9);
      for(const image of architecture){assert.ok(Math.abs(image.ratio-image.native)<0.005,`Complete uncropped composition: ${image.alt}`);assert.equal(image.fit,'contain');assert.equal(image.clipped,false);assert.ok(image.within);assert.ok(image.width<=1360);}
      assert.ok(await page.locator('.cover-bg').evaluate(e=>getComputedStyle(e,'::after').backgroundImage.includes('linear-gradient') && e.getBoundingClientRect().top===document.querySelector('.cover').getBoundingClientRect().top),'Hero must blend the shared architectural backdrop into navy');
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `Horizontal overflow at ${width}`);
      const contrast = await page.locator('#materials .eyebrow, .finish-number, .finish-row dt, .schedule-note').evaluateAll(elements => elements.map(e => {
        const rgb = getComputedStyle(e).color.match(/[\d.]+/g).slice(0,3).map(Number).map(c => {c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;});
        return 1.05 / (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2] + 0.05);
      }));
      assert.ok(contrast.every(ratio => ratio >= 4.5), 'New schedule small text must meet WCAG AA contrast on white');
      assert.equal(await page.locator('.gallery-entry-dining').evaluate(e => [...e.querySelectorAll('img')].every(i => {const r=i.getBoundingClientRect();return Math.abs(r.width / r.height - i.naturalWidth / i.naturalHeight) < 0.005 && r.bottom <= e.getBoundingClientRect().bottom + 1;})), true, 'Entry and Dining must be uncropped, unstretched and contained');
      const links = await page.locator('a').evaluateAll(as => as.map(a => a.getAttribute('href')));
      const oldLinks = await before.locator('a').evaluateAll(as => as.map(a => a.getAttribute('href')));
      for (const link of oldLinks.filter(link => link !== 'assets/fern-finishes-inclusions.pdf')) assert.ok(links.includes(link), `Existing contact/navigation link: ${link}`);
      assert.ok(links.includes('tel:0431179861'));
      assert.ok(links.includes('mailto:chrislewis@stonerealestate.com.au'));
      const pdfLink = page.locator('.schedule-link');
      assert.equal(await pdfLink.getAttribute('target'), '_blank', 'PDF opens in a clean separate tab');
      assert.match(await pdfLink.getAttribute('rel'), /noopener/);
      const pdfUrl = await pdfLink.getAttribute('href');
      assert.match(pdfUrl, /^https:\/\/cdn\.jsdelivr\.net\/gh\/BoggedCake\/3NieldAve@[0-9a-f]{40}\/assets\/fern-finishes-inclusions\.pdf$/);
      const pdfBytes = execFileSync('curl', ['--fail', '--silent', '--show-error', '--location', '--max-time', '30', pdfUrl], {maxBuffer:10e6});
      assert.equal(createHash('sha256').update(pdfBytes).digest('hex'), checksums['fern-finishes-inclusions.pdf']);
      // Use verified PDF bytes for Chromium's cloud proxy trust limitation.
      await context.route(pdfUrl, route => route.fulfill({status:200, contentType:'application/pdf', body:pdfBytes}));
      const popupPromise = context.waitForEvent('page');
      await pdfLink.click();
      const popup = await popupPromise;
      await popup.waitForURL(pdfUrl);
      assert.equal(popup.url(), pdfUrl, 'Click must reach the direct PDF in a new tab');
      await popup.close();
      for (const [i, id] of ['basement', 'ground', 'first'].entries()) {
        await page.locator('.fp-tab').nth(i).click();
        assert.equal(await page.locator('.fp-panel.active').getAttribute('id'), 'fp-' + id);
        assert.equal(await page.locator('.fp-panel:visible').count(), 1);
      }
      await page.locator('.fp-tab').first().click();
      // Protect unchanged section geometry/text; raw before/after images below
      // document the intentionally redesigned gallery without synthetic isolation.
      let unchanged = 0;
      for (const selector of ['.stat-grid', '#materials .section-inner', 'section:has(.fp-tab-bar) .section-inner', '.comp-grid', 'section:has(.location-grid) .section-inner']) {
        const originalBox = await before.locator(selector).boundingBox(), currentBox = await page.locator(selector).boundingBox();
        assert.equal(currentBox.width, originalBox.width, `Preserved section width: ${selector}`);
        assert.equal(currentBox.height, originalBox.height, `Preserved section height: ${selector}`);
        assert.equal(normalize(await page.locator(selector).innerText()), normalize(await before.locator(selector).innerText()), `Protected section content: ${selector}`);
        unchanged++;
      }
      for (const [name, target] of [['before', before], ['after', page]]) {
        await target.locator('.cover').screenshot({path:path.join(output, `cover-${width}-${name}.jpg`),type:'jpeg',quality:85});
        await target.locator(name==='before'?'.baseline-gallery':'.editorial-gallery').screenshot({path:path.join(output,`gallery-${width}-${name}.jpg`),type:'jpeg',quality:85});
        await target.locator('.gallery-entry-dining').screenshot({path:path.join(output, `framing-${width}-${name}.png`)});
        await target.screenshot({path:path.join(output, `page-${width}-${name}.png`), fullPage:true});
      }
      await page.locator('#materials').screenshot({path:path.join(output, `materials-${width}.png`)});
      await page.locator('.partner-grid').screenshot({path:path.join(output, `partners-${width}.png`)});
      await page.locator('.footer-top').screenshot({path:path.join(output, `contact-${width}.png`)});
      assert.deepEqual(errors, [], 'No JavaScript errors');
      assert.deepEqual(failedRequests.filter(r => !/fonts\.(googleapis|gstatic)\.com/.test(r.url)), [], 'No failed application asset requests');
      const metrics = await page.evaluate(() => ({fontLoaded:[...document.fonts].some(f => f.family === 'Poppins' && f.status === 'loaded'), domElements:document.querySelectorAll('*').length, loadMs:performance.getEntriesByType('navigation')[0].loadEventEnd}));
      assert.equal(metrics.fontLoaded, true, 'Real Poppins font faces must load through verified TLS');
      results.push({width, status:'passed', headshot:{visible:true,decoded:headshot.decoded,unobscured:headshot.unobscured,width:headshot.width,height:headshot.height,position:headshot.beside?'beside contact':'above contact'}, categories:reference.length, inclusions:reference.reduce((n,c)=>n+c.items.length,0), images:images.length, unchangedSections:unchanged, errors, failedRequests, ...metrics});
      console.log(JSON.stringify(results.at(-1)));
      if (width === 1440) {
        const resizing=[];
        for(const resizeWidth of [375,400,600,601,767,768,900,1023,1024,1150,1279,1280,1439,1440,1600,1680,1920,2240,2560]) {
          await page.setViewportSize({width:resizeWidth,height:1000});
          await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
          const state=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,complete:[...document.querySelectorAll('.editorial-gallery img,.harbour-feature img')].every(i=>{const r=i.getBoundingClientRect();return Math.abs(r.width/r.height-i.naturalWidth/i.naturalHeight)<0.005;}),exterior:getComputedStyle(document.querySelector('.cover-bg'),'::after').backgroundImage.includes('linear-gradient')}));
          assert.deepEqual(state,{overflow:false,complete:true,exterior:true},`Continuous resize at ${resizeWidth}`);resizing.push({width:resizeWidth,...state});
        }
        fs.writeFileSync(path.join(output,'resize-results.json'),JSON.stringify(resizing,null,2));
        await page.setViewportSize({width:1440,height:1000});
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
