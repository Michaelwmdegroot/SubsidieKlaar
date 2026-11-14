'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
test('photo-led home is real prerendered UI rather than a screenshot',()=>{
 const h=read('index.html');
 for(const cls of ['hero-landscape','hero-copy','dossier-card','benefit-strip','how-panel','document-stack','privacy-band','installer-band','faq-list','bottom-cta']) assert.ok(h.includes('class="'+cls),cls);
 assert.match(h,/<h1>Je subsidieaanvraag,/);assert.match(h,/data-action="start"/);assert.match(h,/data-action="demo"/);
 assert.match(h,/Woningbeeld ter illustratie/);assert.match(h,/Voorbeeld · geen subsidiebesluit/);
 assert.doesNotMatch(h,/100% ISDE-proof|maximale subsidie|voorkomen afwijzing/i);
});
test('optimized original generated images are local WebP files with a size budget',()=>{
 for(const [file,max] of [['home-hero.webp',250000],['home-hero-small.webp',90000]]){
  const b=fs.readFileSync(path.join(root,'assets/images',file));assert.equal(b.subarray(0,4).toString(),'RIFF');assert.equal(b.subarray(8,12).toString(),'WEBP');assert.ok(b.length<=max);
 }
 assert.match(read('index.html'),/src="assets\/images\/home-hero.webp"[^>]*width="1440"[^>]*height="960"/);
 assert.match(read('index.html'),/fetchpriority="high"/);assert.doesNotMatch(read('index.html'),/<img[^>]+src="https?:/);
});
test('static pages share the branded shell and usable mobile navigation without app JS',()=>{
 for(const route of ['hulp','hulp/factuur-warmtepomp','hulp/betaalbewijs','hulp/meldcode','privacy','bronnen','over']){
  const h=read(route+'/index.html');
  for(const cls of ['brand-name','mobile-nav','reading-shell','reading-aside','site-footer']) assert.ok(h.includes('class="'+cls),route+' '+cls);
  assert.match(h,/href="\/#dossier"/);assert.doesNotMatch(h,/data-action=/);assert.match(h,/loading="lazy"/);
 }
});
test('the portable preview inlines both photos including runtime wizard references',()=>{
 const h=read('concept/SubsidieReady.html');assert.match(h,/data:image\/webp;base64,/);
 assert.doesNotMatch(h,/assets\/images\/home-hero(?:-small)?\.webp/);assert.doesNotMatch(h,/<img[^>]+src="https?:/);
 assert.match(h,/data-offline="true"/);assert.doesNotMatch(h,/<script[^>]+src=/);
});
test('new navigation is native, and form focus/reduced motion remain supported',()=>{
 const css=read('assets/style.css'),app=read('assets/app.js');
 assert.match(app,/<details class="mobile-nav"><summary aria-label="Menu openen">/);
 assert.match(css,/prefers-reduced-motion:reduce/);assert.match(css,/focus-visible/);
 assert.match(css,/\.field input,\.field select,\.field textarea\{font-size:16px\}/);
 assert.match(app,/Stap \$\{step\+1\} van 4/);
});
test('primary text and button colors exceed 4.5:1 contrast on their backgrounds',()=>{
 const lum=h=>{const c=[0,2,4].map(i=>parseInt(h.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return c[0]*.2126+c[1]*.7152+c[2]*.0722;};
 for(const [fg,bg] of [['ffffff','0b8507'],['ffffff','0b8105'],['ffffff','075c05'],['0c1732','ffffff'],['606b7e','ffffff']]){const a=lum(fg),b=lum(bg);assert.ok((Math.max(a,b)+.05)/(Math.min(a,b)+.05)>=4.5,fg+'/'+bg);}
});
