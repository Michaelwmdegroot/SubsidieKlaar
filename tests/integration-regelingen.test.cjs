'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
const routes=['/','/regelingen/','/subsidies/','/btw/','/financiering/','/hulp/','/hulp/factuur-warmtepomp/','/hulp/betaalbewijs/','/hulp/meldcode/','/privacy/','/bronnen/','/over/'];
const file=r=>r==='/'?'index.html':r.slice(1)+'index.html';
const links=['/regelingen/','/subsidies/','/btw/','/financiering/','/hulp/'];
test('all public pages use one connected navigation and footer',()=>{
 for(const route of routes){const h=read(file(route));const header=h.match(/<header[\s\S]*?<\/header>/)?.[0];const footer=h.match(/<footer[\s\S]*?<\/footer>/)?.[0];assert.ok(header,route);assert.ok(footer,route);for(const url of links){assert.ok(header.includes(`href="${url}"`),route+' -> '+url);}assert.ok(footer.includes('Warmtepompdossier'),route);if(route!=='/')assert.doesNotMatch(h,/data-action=/);}
});
test('new routes are indexable with self canonical and included in sitemap',()=>{
 for(const route of routes){const h=read(file(route));assert.match(h,/<meta name="robots" content="index, follow">/);assert.ok(h.includes(`rel="canonical" href="https://subsidieready.nl${route}"`));assert.ok(read('sitemap.xml').includes(`<loc>https://subsidieready.nl${route}</loc>`));}
 for(const [,url] of read('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g))for(const p of ['#','?','/api/','/admin/','/concept/'])assert.ok(!url.includes(p));
});
test('public scanner uses local external scripts under the existing strict CSP',()=>{
 const h=read('regelingen/index.html');assert.match(h,/id="scan-fields" disabled/);assert.match(h,/<noscript>/);assert.ok(h.indexOf('/assets/regelingen-engine.js')<h.indexOf('/assets/regelingen-app.js'));
 assert.doesNotMatch(h,/<script>([\s\S]*?)<\/script>/);assert.doesNotMatch(h,/\son(?:click|change|submit)=/i);assert.doesNotMatch(h,/Prototype 2\.0|Werkend prototype, nog niet/);
 assert.ok(read('.htaccess').includes("script-src 'self' 'sha256-"));assert.ok(!read('.htaccess').includes("script-src 'self' 'unsafe-inline'"));
 for(const r of ['index.html','regelingen/index.html'])for(const [,body]of read(r).matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)){const hash=crypto.createHash('sha256').update(body).digest('base64');assert.ok(read('.htaccess').includes("'sha256-"+hash+"'"));}
});
test('published engine is byte-identical to the tested source and metadata cannot be mutated',()=>{
 assert.equal(read('assets/regelingen-engine.js'),read('scripts/regelingen-engine.cjs'));const e=require('../scripts/regelingen-engine.cjs');let a=e.listRoutes();a[0].sources[0].url='https://untrusted.invalid';a[0].measures.push('tamper');assert.ok(!e.listRoutes()[0].sources[0].url.includes('untrusted'));assert.ok(!e.listRoutes()[0].measures.includes('tamper'));const s=e.listSources();s[0].title='tamper';assert.notEqual(e.listSources()[0].title,'tamper');
});
test('scanner keeps answers out of network, browser storage, URLs and marketing',()=>{
 const js=read('assets/regelingen-app.js');assert.doesNotMatch(js,/\b(?:fetch|XMLHttpRequest|sendBeacon|WebSocket|localStorage|sessionStorage|indexedDB)\b/);assert.doesNotMatch(js,/location\.(?:search|hash)\s*=|history\.(?:pushState|replaceState)|SRMetrics|dossierData/);assert.ok(js.includes('JSON.stringify(snapshot,null,2)'));assert.ok(js.includes("document.getElementById('scan-fields').disabled=false"));assert.ok(js.lastIndexOf('disabled=false')>js.indexOf("addEventListener('submit'"));
 const h=read('regelingen/index.html');assert.doesNotMatch(h,/<input[^>]*type="(?:file|email|password|tel)"/);assert.match(h,/Geen inkomen, BSN, BKR, DigiD/);
});
test('warmtepomp workflow remains accessible and has no automatic state handoff',()=>{
 const home=read('index.html'),scan=read('regelingen/index.html'),app=read('assets/app.js'),js=read('assets/regelingen-app.js');assert.ok(home.includes('data-action="start"'));assert.ok(scan.includes('href="/#dossier"'));assert.ok(js.includes('href="/#dossier"'));assert.ok(!scan.includes('/#dossier?'));assert.ok(app.includes("['SubsidieReady','SubsidieKlaar'].includes(raw.app)"));assert.ok(app.includes("location.hash==='#voorbeeld'"));assert.ok(app.includes('dirty&&(!persist||documents.length)'));
});
test('a result becomes invalid when answers change; print and export use latest snapshot',()=>{
 const js=read('assets/regelingen-app.js');assert.ok(js.includes('snapshot=null'));assert.ok(js.includes('De vorige uitkomst is gewist'));assert.ok(js.includes("document.getElementById('print-routes').hidden=true"));assert.ok(js.includes('if(snapshot)window.print()'));assert.ok(js.includes('if(!snapshot)return'));assert.ok(js.includes('URL.revokeObjectURL'));
});
test('public information explains current product limits without promises of future functionality',()=>{
 const scan=read('regelingen/index.html');assert.match(scan,/nog niet beschikbaar/);assert.match(scan,/Lokale dekking is onvolledig/);assert.match(read('btw/index.html'),/21\/121/);assert.match(read('financiering/index.html'),/geen persoonlijke kredietselectie/);assert.match(read('privacy/index.html'),/niet in de URL/);assert.match(read('bronnen/index.html'),/Belastingdienst/);assert.match(read('bronnen/index.html'),/14 december 2026/);
});
test('all internal static links point to real files, directories or anchors',()=>{
 for(const r of routes){const h=read(file(r));for(const [,url]of h.matchAll(/(?:href|src)="(\/(?!\/)[^"]*)"/g)){const pathname=url.split(/[?#]/)[0];const p=path.join(root,pathname);assert.ok(fs.existsSync(p),r+' broken link '+url);if(pathname.endsWith('/'))assert.ok(fs.existsSync(path.join(p,'index.html'))||fs.existsSync(path.join(p,'index.php')),url);}}
});
test('packaging and live verification include the integrated public surface',()=>{
 const pack=read('scripts/package.cjs'),live=read('scripts/check-live.cjs');for(const r of ['regelingen','subsidies','btw','financiering']){assert.ok(pack.includes("'"+r+"'"));assert.ok(live.includes("'/"+r+"/'"));}for(const f of ['.github/workflows/quality.yml','.github/workflows/release.yml'])assert.ok(read(f).includes('regelingen subsidies btw financiering assets/regelingen-engine.js'));
});
