// Hero-only founder refinement: source preservation and actual browser captures.
const assert=require('node:assert/strict');
const fs=require('node:fs'), path=require('node:path'),http=require('node:http');
const {execFileSync,execFile}=require('node:child_process');
const {promisify}=require('node:util');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'), output=process.env.FERN_QA_OUTPUT||'/tmp/fern-hero';
const before=execFileSync('git',['show','e07735c:index.html'],{cwd:root,maxBuffer:10e6}).toString();
const current=fs.readFileSync(path.join(root,'index.html'),'utf8');
// Remove just the desktop and responsive cover rules. Everything else must be exact.
const withoutHero=s=>s.replace(/  \/\* COVER[\s\S]*?(?=  \/\* SECTIONS)/,'').replace(/    \.cover\{[\s\S]*?(?=    \.gallery-entry-dining)/,'');
assert.equal(withoutHero(current),withoutHero(before),'Only hero CSS may change; all artwork, markup, gallery CSS, copy and downstream sections must remain exact');
fs.mkdirSync(output,{recursive:true});
(async()=>{
 const server=http.createServer((req,res)=>{res.setHeader('Content-Type','text/html');res.end(req.url==='/before'?before:current);});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 const cache=new Map(), results=[];
 try{
 for(const width of [390,430,768,1440,1920,2560]){
  const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});
  await context.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//,async route=>{
   const url=route.request().url();if(!cache.has(url))cache.set(url,promisify(execFile)('curl',['--fail','--silent','--show-error','--location','--max-time','30',url],{encoding:'buffer',maxBuffer:10e6}));
   await route.fulfill({status:200,contentType:url.includes('googleapis')?'text/css':'font/ttf',body:(await cache.get(url)).stdout});
  });
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const state of ['before','after']){
   await page.goto(`http://127.0.0.1:${server.address().port}/${state}`,{waitUntil:'networkidle'});
   await page.evaluate(async()=>{await document.fonts.ready;await document.querySelector('.logo-img').decode();const i=new Image();i.src=getComputedStyle(document.querySelector('.cover-bg')).backgroundImage.slice(5,-2);await i.decode();});
   if(state==='after'){
    const geometry=await page.evaluate(()=>{
     const rect=s=>{const r=document.querySelector(s).getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height};};
     return {cover:rect('.cover'),background:rect('.cover-bg'),header:rect('.cover-header'),content:rect('.cover-content'),logo:rect('.logo-img'),tag:rect('.cover-tag'),title:rect('.cover-title'),eyebrow:rect('.cover-eyebrow'),stats:rect('.cover-stats'),fadeWidth:innerWidth<1024?document.querySelector('.cover-bg').clientWidth:parseFloat(getComputedStyle(document.querySelector('.cover-bg'),'::after').backgroundSize.split(',')[1]),gradient:getComputedStyle(document.querySelector('.cover-bg'),'::after').backgroundImage,overflow:document.documentElement.scrollWidth>innerWidth,font:document.fonts.check('14px Poppins')};
    });
    assert.equal(geometry.overflow,false);assert.equal(geometry.font,true);assert.match(geometry.gradient,/linear-gradient/);
    assert.equal(geometry.background.top,geometry.cover.top,'Image must share the header background');
    assert.ok(geometry.header.bottom<geometry.eyebrow.top,'Header and text must not overlap');
    assert.ok(geometry.logo.right<geometry.tag.left,'Logo and opportunity label must not overlap');
    assert.ok(geometry.stats.bottom<=geometry.cover.bottom-30);
    for(const name of ['logo','tag','title','eyebrow','stats']){const r=geometry[name];assert.ok(r.left>=geometry.cover.left&&r.right<=geometry.cover.right,`${name} within hero`);}
    assert.equal(geometry.fadeWidth,width<1024?geometry.background.width:geometry.background.height,'Fade must reach navy exactly at the image edge');
    if(width<1024)assert.ok(geometry.eyebrow.top<geometry.background.bottom,'Mobile copy must overlap the fading render rather than form a separate block');
    results.push({width,status:'passed',...geometry,errors});
   }
   await page.locator('.cover').screenshot({path:path.join(output,`hero-${width}-${state}.jpg`),type:'jpeg',quality:90});
  }
  assert.deepEqual(errors,[]);await context.close();console.log(`${width}px hero passed`);
 }
 fs.writeFileSync(path.join(output,'results.json'),JSON.stringify(results,null,2));
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
