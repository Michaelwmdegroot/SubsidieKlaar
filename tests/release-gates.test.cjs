'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
test('authorized domain launch is indexable; offline copy and private routes are not',()=>{
 assert.ok(/<meta name="robots" content="index, follow">/.test(read('index.html')));
 assert.ok(/<meta name="robots" content="noindex, nofollow">/.test(read('concept/SubsidieReady.html')));
 assert.ok(read('index.html').includes('rel="canonical" href="https://subsidieready.nl/"'));
 const robots=read('robots.txt');assert.ok(/^Allow: \/$/m.test(robots));
 for(const route of ['admin','api','server','docs','scripts','concept'])assert.ok(robots.includes('Disallow: /'+route+'/'));
 assert.ok(!read('sitemap.xml').includes('/admin/'));assert.ok(!read('sitemap.xml').includes('/api/'));
});
test('all executable and styling resources in the public entrypoint are locally bundled',()=>{
 const html=read('index.html');
 const scripts=[...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)].map(m=>m[1]);
 const assets=[...scripts,...[...html.matchAll(/<link rel="(?:icon|stylesheet)"[^>]*href="([^"]+)"/g)].map(m=>m[1])];
 assert.ok(assets.length>=7);for(const file of assets){assert.ok(!/^(?:https?:)?\/\//i.test(file));assert.ok(fs.existsSync(path.join(root,file)));}
});
test('portable distribution remains standalone and makes no metrics requests',()=>{
 const html=read('concept/SubsidieReady.html');
 assert.ok(!/<script\b[^>]*\bsrc\s*=/i.test(html));assert.ok(!/<link\b[^>]*rel="stylesheet"[^>]*href=/i.test(html));
 assert.ok(!/(?:src|href)="(?:\.\.?\/)?(?:assets|vendor)\//i.test(html));
 assert.ok(html.includes('data:font/ttf;base64,'));assert.ok(html.includes('data:image/svg+xml;base64,'));
 assert.ok(html.includes('Third-party license notices'));assert.ok(!html.includes("fetch('/api/event.php'"));
});
test('homepage is prerendered and all discoverable local information links exist',()=>{
 const html=read('index.html');assert.ok(html.includes('<h1>Verduurzamen?'));
 assert.ok(!html.includes('<!-- PRERENDER -->'));
 for(const route of ['hulp','hulp/factuur-warmtepomp','hulp/betaalbewijs','hulp/meldcode','privacy','bronnen','over']){
  const file=read(route+'/index.html');assert.ok(file.includes('https://subsidieready.nl/'+route+'/'));assert.ok(file.includes('<h1>'));
 }
 assert.ok(!html.includes('Backoffice concept'));
});
test('production headers deny private source paths and constrain executable content',()=>{
 const rules=read('.htaccess');for(const name of ['server','scripts','tests','templates','docs','concept'])assert.ok(rules.includes(name));
 assert.ok(rules.includes("script-src 'self' 'sha256-"));assert.ok(rules.includes("object-src 'none'"));assert.ok(rules.includes('Options -Indexes'));
});
test('new brand accepts legacy projects and never passes dossier data to telemetry',()=>{
 const app=read('assets/app.js');assert.ok(app.includes("['SubsidieReady','SubsidieKlaar'].includes(raw.app)"));
 const metrics=read('assets/metrics.js');assert.ok(metrics.includes('JSON.stringify({event})'));
 assert.ok(!/state\.|\.files\b|FormData|\.value\b|document\.forms/.test(metrics));
 assert.ok(metrics.includes("choice !== 'allow'"));assert.ok(metrics.includes('|| demo ||'));
});
