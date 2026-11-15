'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const standard=['index.html','regelingen/index.html','subsidies/index.html','btw/index.html','financiering/index.html','hulp/index.html','hulp/factuur-warmtepomp/index.html','hulp/betaalbewijs/index.html','hulp/meldcode/index.html','bronnen/index.html','privacy/index.html','voorwaarden/index.html','over/index.html','404.html'];
const next=['mijn-plan','advies','sales','bronbeheer','hulp/isolatie-checklist','hulp/zonnepanelen-btw','hulp/thuisbatterij-btw','hulp/lokale-regelingen'].map(p=>p+'/index.html');
const link=/<link rel="stylesheet" href="\/?assets\/site-theme\.css">/g;
test('site theme: all generated site surfaces include exactly one shared stylesheet',()=>{
 for(const p of [...standard,...next])assert.equal([...read(p).matchAll(link)].length,1,p);
 assert.equal([...read('admin/index.php').matchAll(link)].length,2,'both existing admin responses get the shared styling');
});
test('site theme: information pages have one heading, intact article anchors and branded side action',()=>{
 for(const p of [...standard.filter(x=>!['index.html','regelingen/index.html'].includes(x)),...next.filter(x=>x.startsWith('hulp/'))]){
  const h=read(p);assert.equal([...h.matchAll(/<h1\b/g)].length,1,p);assert.match(h,/class="sr-page-hero"/);assert.match(h,/class="reading-shell"/);assert.match(h,/class="reading-aside"/);assert.match(h,/class="article-aside-card sr-action-card"/);
  for(const [,id]of h.matchAll(/href="#(onderdeel-\d+)"/g))assert.ok(h.includes('id="'+id+'"'),p+' '+id);
 }
});
test('site theme: navigation preserves all destinations and a single mobile My plan link',()=>{
 for(const p of [...standard,...next]){const h=read(p),mobile=h.match(/<details class="mobile-nav">[\s\S]*?<\/details>/)?.[0];assert.ok(mobile,p);assert.equal([...mobile.matchAll(/href="\/mijn-plan\/"/g)].length,1,p);for(const r of ['/regelingen/','/subsidies/','/btw/','/financiering/','/hulp/','/mijn-plan/'])assert.ok(h.includes('href="'+r+'"'),p+' '+r);}
});
test('site theme: current navigation is indicated without JavaScript',()=>{
 for(const route of ['subsidies','btw','financiering','hulp','mijn-plan'])assert.ok(read(route+'/index.html').includes('href="/'+route+'/" aria-current="page"'),route);
 assert.ok(read('hulp/betaalbewijs/index.html').includes('href="/hulp/" aria-current="location"'));
});
test('site theme: all relevant new preparation articles are discoverable from knowledge index',()=>{
 const h=read('hulp/index.html');for(const route of ['isolatie-checklist','zonnepanelen-btw','thuisbatterij-btw','lokale-regelingen'])assert.ok(h.includes('href="/hulp/'+route+'/"'));
});
test('site theme: shared design includes accessibility and paper rendering without remote assets',()=>{
 const css=read('assets/site-theme.css');assert.match(css,/focus-visible/);assert.match(css,/prefers-reduced-motion/);assert.match(css,/@media print/);assert.match(css,/font-size:16px/);assert.doesNotMatch(css,/@import|url\(['"]?https?:/);
 assert.match(css,/\.home-page \.bottom-cta h2,\.home-page \.installer-band h2\{color:var\(--sr-ink\)\}/);
});
test('site theme: decoration never replaces meaningful interface text or government claims',()=>{
 const h=read('subsidies/index.html');assert.match(h,/Jij bereidt voor\. De uitvoerder beslist/);assert.match(h,/<img[^>]+dashboard-dossier.webp[^>]+alt=""/);assert.doesNotMatch(h,/100% ISDE-proof|gegarandeerde subsidie|voorkomen afwijzing/i);
 const mod=read('scripts/site-design.cjs');assert.doesNotMatch(mod,/\b(?:fetch|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|eval)\s*\(/);
});
test('site theme: reviewed articles are public while all other preview and backend gates stay closed',()=>{
 const reviewed=['hulp/zonnepanelen-btw/index.html','hulp/thuisbatterij-btw/index.html'];
 for(const p of next.filter(p=>!reviewed.includes(p)))assert.match(read(p),/name="robots" content="noindex,nofollow"/);
 for(const p of reviewed)assert.match(read(p),/name="robots" content="index, follow"/);
 for(const p of standard.filter(x=>x!=='404.html'))assert.match(read(p),/name="robots" content="index, follow"/);
 const service=read('server/next/service.php');assert.match(service,/Productiedomein niet toegestaan/);assert.match(read('api/next/index.php'),/configured.*false/);assert.equal(JSON.parse(read('next-version.json')).cloudDefault,'disabled');
});
test('site theme: standalone builds embed shared visuals and make no additional asset requests',()=>{
 const offline=read('concept/SubsidieReady.html');assert.doesNotMatch(offline,/<link[^>]+rel="stylesheet"|<script[^>]+src=/);assert.ok(offline.includes('SubsidieReady shared visual system'));assert.doesNotMatch(offline,/url\(['"]?\/?assets\/images/);
 const {make}=require('../scripts/next/offline.cjs');for(const route of ['mijn-plan','sales']){const h=make(route);assert.ok(h.includes('data-offline="true"'));assert.doesNotMatch(h,/url\(['"]?\/?assets\/images|<link[^>]+rel="stylesheet"/);assert.match(h,/data:image\/webp;base64/);}
});
test('site theme: shared primary palette has legible contrast at both gradient endpoints',()=>{
 const lum=h=>{const v=[0,2,4].map(i=>parseInt(h.slice(i,i+2),16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return v[0]*.2126+v[1]*.7152+v[2]*.0722;};
 for(const[fg,bg]of [['ffffff','0d7d09'],['ffffff','057110'],['ffffff','005823'],['0d1b35','ffffff'],['4f6279','ffffff']]){const a=lum(fg),b=lum(bg);assert.ok((Math.max(a,b)+.05)/(Math.min(a,b)+.05)>=4.5,fg+'/'+bg);}
});

test('site theme: reviewed account-service update and all other engines remain byte-identical',()=>{
 const expected={"assets/core.js": "119d10364dc36c5188a8e71941bc8fee7388f003faf8e16ac2a235c1ffed4b89", "assets/export.js": "4d64f9ed793550dbdfe7108ba4610042a552f8794669b6e3f55fa075c945cf6d", "assets/metrics.js": "b72ee4ad4cdce17fcd717756c52adadac526db80877575415c5817d5e53f96d8", "scripts/regelingen-engine.cjs": "b518fefb8e71168595ead1b6a0e862e8bb6653b1b6e2bfdf32edecc1cf387c80", "assets/regelingen-app.js": "0bc3f09339d05210cedbba71341368d6f847dedd8b6ca8862d3ba30d545e1970", "assets/regelingen.css": "86e7bd69d41b0e4fa80cd33d601d0f496fcd75410c5c7a038697a6469c0aa53f", "assets/plan-core.js": "4d8459832dc02de4fcc756b97d88d2302e7b3f04bebf9a629d792ee78eec0e87", "assets/workbench-rules.js": "0499a3be87a9fa038b391ab73c5cc5a8af0bcf31b8a2553edaf615e016175f17", "assets/plan-bridge.js": "05b0b224c367cd7b22abb84a0374a2579e0f23fbe5fec2fad26e5eb6c22f2d1b", "assets/next-api.js": "80e2c48ce73647ef9d9d1ff850d00e7d23af0da99e55571b3f9feba2e30b71a8", "server/bootstrap.php": "d2c7d4a8030c2bf7686dcbac0c57ebdb7f64d4154d8af696a03961b8909592ab", "server/next/service.php": "3e34012e3f56ba306fbbf7fa2a1361f7cdc03962d5f6bac7f63696847d264e66", "api/next/index.php": "886ba3b230fdd34d7c32f0ff366ebc7fe5c95728fecb5d6a89bc1134b6a23da1", "api/event.php": "d0db9690f4250f8a183357f25a99a51347bfec7bfd433a4559213b0a4e051caf", "api/health.php": "2bb468174a64644eb0f363a3fdb6f42d2195a2fc89c47142dafee717421335b2", "api/settings.php": "718a1cfc65534e5128b01386610ed1e580f1a39e32f72d9f78d0959ead1bfc8e", "assets/sales-app.js": "ce25bd8742571c4f5ccc18c49502372a3c2198633e71a707698cd457bd3db8eb"};
 for(const[p,hash]of Object.entries(expected)){
  let source=read(p);
  assert.equal(crypto.createHash('sha256').update(source).digest('hex'),hash,p);
 }
});
test('site theme: admin change adds styling only, without changing any PHP authentication logic',()=>{
 const before=read('admin/index.php').replaceAll('<link rel="stylesheet" href="/assets/site-theme.css">','');
 assert.equal(crypto.createHash('sha256').update(before).digest('hex'),'4fa5b4d49e6f9e41ee509839829f6cd3d3eb371c6b60d61491cb18de4f9c83aa');
});
