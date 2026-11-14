'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
const manifest=JSON.parse(read('docs/DASHBOARD-ASSETS.json'));
test('premium: approved generated assets are local WebP, bounded and hash-verified',()=>{
 assert.equal(manifest.length,5);let total=0;
 for(const a of manifest){const b=fs.readFileSync(path.join(root,a.file));total+=b.length;assert.equal(b.toString('ascii',0,4),'RIFF');assert.equal(b.toString('ascii',8,12),'WEBP');assert.equal(b.length,a.bytes);assert.equal(crypto.createHash('sha256').update(b).digest('hex'),a.sha256);assert.ok(b.length<130000);assert.ok(a.origin.includes('Generated with GPT Images'));}
 assert.ok(total<225000,'All optimized resolutions should stay under 225 KB');
});
test('premium: all important labels and interactions are HTML, generated images decorative',()=>{
 const h=read('regelingen/index.html');
 for(const cls of ['r-hero-house','r-hero-badge','r-detail-art','r-trust-icon']){
  const tag=h.match(new RegExp('<img[^>]+class="'+cls+'"[^>]*>'))?.[0];assert.ok(tag,cls);assert.match(tag,/alt=""/);assert.match(tag,/width="\d+"/);assert.match(tag,/height="\d+"/);
 }
 for(const text of ['Gebaseerd op officiële bronnen','Jouw mogelijke regelingen','Kies je','maatregelen','Vertel iets over je situatie','Maak mijn plan'])assert.ok(h.includes(text));
 assert.equal((h.match(/<input type="checkbox" name="measures"/g)||[]).length,9);
 assert.equal((h.match(/class="r-glyph"/g)||[]).length,9);
});
test('premium: no illustrative euro estimates or best-match claims become real benefits',()=>{
 for(const f of ['templates/regelingen-page.html','assets/regelingen-app.js']){
  const s=read(f);assert.doesNotMatch(s,/€\s*(?:3[.,]200|1[.,]200)|Verwachte besparing|21% btw-voordeel|Meest relevant|totalSavings|estimatedGrant/);
 }
 assert.ok(read('assets/regelingen-app.js').includes("all.length+' routes'"));
});
test('premium: image assets included in release identity and local package',()=>{
 const build=read('scripts/build-site.cjs');for(const a of manifest)assert.ok(build.includes(a.file),a.file);
 assert.ok(read('scripts/package.cjs').includes("'assets'"));
});
test('premium: keyboard navigation and viewport adaptation retain actual controls',()=>{
 const s=read('assets/regelingen-app.js');for(const k of ['ArrowLeft','ArrowRight','Home','End','preventScroll:true','visualViewport','ResizeObserver'])assert.ok(s.includes(k),k);
 const h=read('regelingen/index.html');for(const k of ['selection','profile','routes'])assert.ok(h.includes(`data-guide="${k}"`));
 assert.equal((h.match(/id="use-in-plan"/g)||[]).length,1);
});
test('premium: mobile header hides cramped CTAs and retains plan link in native menu',()=>{
 const h=read('regelingen/index.html'),nav=h.match(/<details class="mobile-nav">[\s\S]*?<\/details>/)?.[0];assert.ok(nav?.includes('href="/mijn-plan/"'));
 const css=read('assets/regelingen.css');assert.ok(css.includes('.nav-actions>.btn{display:none}'));assert.ok(css.includes('-webkit-appearance:none'));assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
});
test('premium: rule engine, data boundaries, private backend gates preserved',()=>{
 assert.equal(read('assets/regelingen-engine.js'),read('scripts/regelingen-engine.cjs'));
 const app=read('assets/regelingen-app.js');assert.doesNotMatch(app,/\b(?:fetch|XMLHttpRequest|sendBeacon|WebSocket|localStorage|sessionStorage|indexedDB|SRMetrics)\b/);
 assert.match(read('server/next/service.php'),/Productiedomein niet toegestaan/);
 assert.equal(JSON.parse(read('next-version.json')).cloudDefault,'disabled');
});
test('premium: clear print/export and explicit plan handoff remain functional',()=>{
 const app=read('assets/regelingen-app.js'),h=read('regelingen/index.html');assert.ok(app.includes('if(snapshot)window.print()'));assert.ok(app.includes('JSON.stringify(snapshot,null,2)'));
 assert.match(h,/id="print-routes"[^>]+hidden/);assert.match(h,/id="export"[^>]+hidden/);assert.match(h,/id="use-in-plan"[^>]+disabled/);
 assert.ok(read('assets/plan-bridge.js').includes("b.addEventListener('click'"));
});
