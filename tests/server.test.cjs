'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),net=require('node:net');
const {spawn,spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const available=spawnSync('php',['-v']).status===0;
const sleep=n=>new Promise(resolve=>setTimeout(resolve,n));
async function freePort(){const s=net.createServer();await new Promise(r=>s.listen(0,'127.0.0.1',r));const p=s.address().port;await new Promise(r=>s.close(r));return p;}
function cookie(r){return r.headers.get('set-cookie')?.split(';')[0]||'';}
function csrf(html){return html.match(/name="csrf" value="([a-f0-9]{64})"/)?.[1];}
test('PHP backoffice, event boundary, authentication and private storage',{skip:!available},async t=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'sr-test-')),port=await freePort(),origin='http://127.0.0.1:'+port;
 const env={...process.env,SUBSIDIEREADY_PRIVATE_DIR:dir,SR_TEST_HTTP:'1',SR_TEST_ORIGIN:origin};
 const proc=spawn('php',['-S','127.0.0.1:'+port,'-t',root],{cwd:root,env,stdio:'ignore'});
 t.after(()=>{proc.kill();fs.rmSync(dir,{recursive:true,force:true});});
 for(let i=0;i<70;i++){try{await fetch(origin+'/api/health.php');break;}catch{await sleep(40);}}
 const get=(p,h={})=>fetch(origin+p,{headers:h,redirect:'manual'});
 const event=(body,headers={})=>fetch(origin+'/api/event.php',{method:'POST',headers:{'Content-Type':'application/json',Origin:origin,...headers},body:typeof body==='string'?body:JSON.stringify(body)});
 await t.test('unconfigured backend fails closed and has no registration/default login',async()=>{
  const r=await get('/api/settings.php');assert.equal(r.status,200);assert.deepEqual(await r.json(),{service:'SubsidieReady',version:'1.0.0',analytics:false});
  const a=await get('/admin/');assert.equal(a.status,503);assert.equal(a.headers.get('set-cookie'),null);
  assert.equal((await event({event:'start'})).status,503);
 });
 const password='Synthetic-test-only-password-938!';
 const hash=spawnSync('php',['-r','echo password_hash($argv[1], PASSWORD_BCRYPT);',password],{encoding:'utf8'}).stdout;
 const config={base_url:'https://subsidieready.nl',operator:'QA <script>not HTML</script>',contact:'qa@example.invalid',password_hash:hash,secret:'d'.repeat(64),analytics_enabled:true};
 fs.writeFileSync(path.join(dir,'config.php'),'<?php return json_decode(base64_decode("'+Buffer.from(JSON.stringify(config)).toString('base64')+'"),true);');
 await t.test('settings exposes only intended public metadata, never a hash or secret',async()=>{
  const r=await get('/api/settings.php'),v=await r.json();assert.equal(v.analytics,true);assert.equal(v.operator,config.operator);assert.equal(v.contact,config.contact);
  assert.equal(v.secret,undefined);assert.equal(v.password_hash,undefined);assert.match(r.headers.get('cache-control'),/no-store/);assert.match(r.headers.get('x-robots-tag'),/noindex/);
 });
 await t.test('collection rejects wrong method, origin, content type, schema and size',async()=>{
  assert.equal((await get('/api/event.php')).status,405);
  assert.equal((await event({event:'start'},{Origin:'https://evil.invalid'})).status,403);
  assert.equal((await event({event:'start'},{'Content-Type':'text/plain'})).status,415);
  for(const v of [{event:'unknown'},{event:'pdf',name:'DO-NOT-STORE'},[],null,'{bad'])assert.equal((await event(v)).status,400);
  assert.equal((await event('x'.repeat(129))).status,413);
  assert.ok(!fs.existsSync(path.join(dir,'stats')));
 });
 await t.test('valid request stores only day/event totals; no submitted identity survives',async()=>{
  assert.equal((await event({event:'start'})).status,202);assert.equal((await event({event:'pdf'})).status,202);
  const files=fs.readdirSync(path.join(dir,'stats')).filter(f=>f.endsWith('.json'));assert.equal(files.length,1);
  const data=JSON.parse(fs.readFileSync(path.join(dir,'stats',files[0])));assert.deepEqual(data,{start:1,pdf:1});
  const rate=fs.readFileSync(path.join(dir,'rate.json'),'utf8');assert.ok(!rate.includes('127.0.0.1'));assert.ok(!rate.includes('DO-NOT-STORE'));
 });
 let c,token;
 await t.test('dashboard/export unauthenticated are login pages without counters',async()=>{
  const r=await get('/admin/?export=1'),text=await r.text();assert.equal(r.status,200);assert.ok(text.includes('Beheerderswachtwoord'));assert.ok(!text.includes('Dossiers gestart'));
  c=cookie(r);token=csrf(text);assert.ok(c);assert.ok(token);assert.match(r.headers.get('set-cookie'),/HttpOnly/i);assert.match(r.headers.get('set-cookie'),/SameSite=Strict/i);
 });
 const login=(pass,extra={})=>fetch(origin+'/admin/',{method:'POST',headers:{Cookie:c,Origin:origin,'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({password:pass,csrf:token,...extra}),redirect:'manual'});
 await t.test('CSRF is required; wrong password fails; valid password rotates the session',async()=>{
  assert.equal((await login(password,{csrf:'0'.repeat(64)})).status,403);
  assert.equal((await login('wrong')).status,401);
  const r=await login(password);assert.equal(r.status,303);assert.equal(r.headers.get('location'),'/admin/');
  const old=c;c=cookie(r);assert.ok(c);assert.notEqual(c,old);
  const oldPage=await(await get('/admin/',{Cookie:old})).text();assert.ok(oldPage.includes('Beheerderswachtwoord'));
 });
 await t.test('authenticated dashboard is escaped and export contains correct counters only',async()=>{
  const r=await get('/admin/',{Cookie:c}),text=await r.text();assert.ok(text.includes('Dossiers gestart'));assert.ok(text.includes('QA &lt;script&gt;not HTML&lt;/script&gt;'));
  assert.ok(!text.includes(config.secret));assert.ok(!text.includes(config.password_hash));token=csrf(text);
  const out=await get('/admin/?export=1',{Cookie:c}),json=await out.json();assert.equal(json.totals.start,1);assert.equal(json.totals.pdf,1);assert.match(out.headers.get('content-disposition'),/attachment/);
 });
 await t.test('expired day totals are removed, without showing fabricated replacement counts',async()=>{
  fs.writeFileSync(path.join(dir,'stats','2020-01-01.json'),'{"visit":1000}');
  const result=await(await get('/admin/?export=1',{Cookie:c})).json();assert.equal(result.totals.visit,0);assert.ok(!fs.existsSync(path.join(dir,'stats','2020-01-01.json')));
 });
 await t.test('logout invalidates the authenticated session',async()=>{
  const r=await login(password,{action:'logout'});assert.equal(r.status,303);
  const page=await(await get('/admin/',{Cookie:c})).text();assert.ok(page.includes('Beheerderswachtwoord'));
 });
 await t.test('login brute force is bounded',async()=>{
  const r=await get('/admin/');c=cookie(r);token=csrf(await r.text());let status;
  for(let i=0;i<12;i++)status=(await login('incorrect')).status;
  assert.equal(status,429);
 });
 await t.test('event abuse limits are enforced',async()=>{
  let status;for(let i=0;i<121;i++)status=(await event({event:'visit'})).status;assert.equal(status,429);
 });
 await t.test('private directory cannot be placed inside the document root',()=>{
  const code=`require ${JSON.stringify(path.join(root,'server/bootstrap.php'))};try{sr_private_dir();exit(2);}catch(Throwable $e){exit(0);}`;
  assert.equal(spawnSync('php',['-r',code],{env:{...env,SUBSIDIEREADY_PRIVATE_DIR:root}}).status,0);
 });
 await t.test('CLI-only setup refuses web execution',async()=>{
  const r=await get('/scripts/setup-admin.php');assert.equal(r.status,404);
 });
});
