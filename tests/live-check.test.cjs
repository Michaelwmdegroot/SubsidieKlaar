'use strict';
const test = require('node:test'), assert = require('node:assert/strict');
const {checkLive, bodyText} = require('../scripts/check-live.cjs');
const origin = 'https://subsidieready.nl';
const expected = {product:'SubsidieReady',version:'1.0.0',build:'test-build',documents:'browser-only'};
const nextExpected = require('../next-version.json');
const betaPages = ['/mijn-plan/','/advies/','/sales/','/bronbeheer/'];
const pages = ['/regelingen/','/subsidies/','/btw/','/financiering/','/hulp/','/hulp/factuur-warmtepomp/','/hulp/betaalbewijs/','/hulp/meldcode/','/privacy/','/bronnen/','/over/'];
function fixture(overrides = {}) {
  const calls = [];
  function response(url) {
    let status = 200, text = '', headers = {'Content-Type':'text/html'};
    const p = new URL(url).pathname;
    if (url === 'http://subsidieready.nl/' || url === 'https://www.subsidieready.nl/') {
      status = 301; headers.Location = origin + '/';
    } else if (p === '/') {
      text = '<title>SubsidieReady — documenten</title><link rel="canonical" href="'+origin+'/"><h1>Je dossier</h1>';
      Object.assign(headers, {'X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Strict-Transport-Security':'max-age=31536000',
        'Content-Security-Policy':"default-src 'self'; object-src 'none'; frame-ancestors 'none'"});
    } else if (p === '/version.json') {
      headers['Content-Type']='application/json';text=JSON.stringify(expected);
    } else if (p === '/next-version.json') {
      headers['Content-Type']='application/json';text=JSON.stringify(nextExpected);
    } else if (p.startsWith('/api/')) {
      headers['Content-Type']='application/json';headers['X-Robots-Tag']='noindex, nofollow';
      if (p === '/api/next/') {status=503;headers['Cache-Control']='no-store, private';text=JSON.stringify({configured:false,error:'Online functies zijn niet geconfigureerd.'});}
      else text=JSON.stringify(p.endsWith('health.php')?{service:'SubsidieReady',version:'1.0.0',status:'ok',document_processing:'browser-only'}:{service:'SubsidieReady',analytics:false});
    } else if (betaPages.includes(p)) {text='<title>SubsidieReady testrelease</title><meta name="robots" content="noindex,nofollow"><h1>Mijn plan</h1>';headers['X-Robots-Tag']='noindex, nofollow';}
    else if (pages.includes(p)) text='<h1>SubsidieReady uitleg</h1>';
    else if (p.startsWith('/assets/')) {headers['Content-Type']=p.endsWith('.css')?'text/css':'application/javascript';text='x'.repeat(1001);}
    else if (p === '/robots.txt') text='User-agent: *\nDisallow: /admin/\nSitemap: '+origin+'/sitemap.xml\n';
    else if (p === '/sitemap.xml') text=['/',...pages].map(p=>'<loc>'+origin+p+'</loc>').join('');
    else if (p === '/admin/') {status=503;text='Beheer is nog niet geactiveerd.';headers['X-Robots-Tag']='noindex';headers['Cache-Control']='no-store, private';}
    else status=404;
    const base={status,headers,text}, changed=overrides[url] || overrides[p];
    return changed ? {...base,...changed,headers:{...headers,...changed.headers}} : base;
  }
  return {calls,fetchImpl: async (url, options) => {calls.push({url,options});const r=response(url);return new Response(r.text,{status:r.status,headers:r.headers});}};
}
const failed = (r, name) => r.checks.some(c=>c.name.includes(name) && !c.pass);
test('public release can pass with admin and analytics explicitly unconfigured',async()=>{
  const f=fixture(),r=await checkLive({expected,fetchImpl:f.fetchImpl});assert.equal(r.ok,true);assert.ok(r.warnings.some(w=>w.includes('niet geactiveerd')));
  for(const {url,options} of f.calls){assert.equal(options.method,'GET');assert.equal(options.redirect,'manual');assert.equal(options.credentials,'omit');assert.equal(options.body,undefined);assert.equal(options.headers.Cookie,undefined);assert.ok(['subsidieready.nl','www.subsidieready.nl'].includes(new URL(url).hostname));}
});
test('network failure does not trigger further probes or leak error messages',async()=>{
  let n=0;const r=await checkLive({expected,fetchImpl:async()=>{n++;throw Error('SECRET-DO-NOT-LOG');}});
  assert.equal(n,1);assert.equal(r.ok,false);assert.ok(!JSON.stringify(r).includes('SECRET-DO-NOT-LOG'));
});
test('parking page or redirect is not accepted and is not followed',async()=>{
  const f=fixture({'/':{status:302,text:'Hostinger',headers:{Location:'https://other.invalid'}}});const r=await checkLive({expected,fetchImpl:f.fetchImpl});
  assert.equal(r.ok,false);assert.equal(f.calls.length,1);
});
test('wrong deployed build fails even when all other pages work',async()=>{
  const f=fixture({'/version.json':{text:JSON.stringify({...expected,build:'stale'})}}),r=await checkLive({expected,fetchImpl:f.fetchImpl});assert.ok(failed(r,'Exacte release'));
});
test('raw PHP source is not an operational PHP endpoint',async()=>{
  const f=fixture({'/api/health.php':{text:'<?php SECRET',headers:{'Content-Type':'text/plain'}}}),r=await checkLive({expected,fetchImpl:f.fetchImpl});
  assert.ok(failed(r,'PHP voert'));assert.ok(!JSON.stringify(r).includes('<?php'));
});
test('public config cannot expose unexpected secret fields',async()=>{
  const f=fixture({'/api/settings.php':{text:JSON.stringify({service:'SubsidieReady',analytics:false,secret:'DO-NOT-LOG'})}}),r=await checkLive({expected,fetchImpl:f.fetchImpl});
  assert.ok(failed(r,'Publieke instellingen'));assert.ok(!JSON.stringify(r).includes('DO-NOT-LOG'));
});
test('private file exposure, soft 404 and indexing block fail independently',async()=>{
  const f=fixture({'/.env':{status:200,text:'SECRET'},'/sr-acceptance-does-not-exist':{status:200},'/robots.txt':{text:'Disallow: /\n'}}),r=await checkLive({expected,fetchImpl:f.fetchImpl});
  assert.ok(failed(r,'/.env'));assert.ok(failed(r,'HTTP 404'));assert.ok(failed(r,'Robots'));
});
test('configured admin must stay at login and use secure cookies',async()=>{
  const login={status:200,text:'<input name="password"><input name="csrf">',headers:{'Set-Cookie':'__Host-SRAdmin=example; Path=/; Secure; HttpOnly; SameSite=Strict'}};
  const f=fixture({'/admin/':login}),r=await checkLive({expected,fetchImpl:f.fetchImpl});assert.equal(r.ok,true);
  const bad=fixture({'/admin/':{...login,headers:{'Set-Cookie':'SRAdmin=bad; Path=/'}}}),b=await checkLive({expected,fetchImpl:bad.fetchImpl});assert.ok(failed(b,'Beheer blijft'));
});
test('unauthenticated stats export is a failure, not a valid dashboard',async()=>{
  const f=fixture({[origin+'/admin/?export=1']:{status:200,text:'{"totals":{"visit":99}}',headers:{'Content-Type':'application/json'}}}),r=await checkLive({expected,fetchImpl:f.fetchImpl});assert.ok(failed(r,'?export=1'));
});
test('response bytes are bounded and release identity is required',async()=>{
  await assert.rejects(()=>bodyText(new Response('x'.repeat(6*1024*1024+1))),/response-too-large/);
  await assert.rejects(()=>checkLive({expected:{}}),/metadata/);
});

test('beta release is not accepted if an account service is active on production',async()=>{
  const f=fixture({'/api/next/':{status:200,text:JSON.stringify({configured:true,accounts:true})}}),r=await checkLive({expected,fetchImpl:f.fetchImpl});
  assert.ok(failed(r,'Account- en sales-API'));
});
test('beta pages must be reachable and not indexable',async()=>{
  const f=fixture({'/sales/':{headers:{'X-Robots-Tag':''}}}),r=await checkLive({expected,fetchImpl:f.fetchImpl});
  assert.ok(failed(r,'/sales/'));
});
test('stale beta version is detected independently of existing v1',async()=>{
  const f=fixture({'/next-version.json':{text:JSON.stringify({...nextExpected,build:'stale'})}}),r=await checkLive({expected,fetchImpl:f.fetchImpl});
  assert.ok(failed(r,'Exacte proefversie'));
});
