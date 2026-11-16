'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),net=require('node:net'),{spawn,execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),P=require('../assets/plan-core.js');
const freePort=()=>new Promise(resolve=>{const s=net.createServer();s.listen(0,'127.0.0.1',()=>{const p=s.address().port;s.close(()=>resolve(p));});});
test('next: real PHP API privacy, authentication, cloud isolation, vault and sales',async t=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'sr-next-test-')),privateDir=path.join(dir,'private'),port=await freePort(),base=`http://127.0.0.1:${port}`;
 execFileSync('php',['scripts/next/setup.php','--local','--dir='+privateDir,'--origin='+base],{cwd:root,stdio:'pipe'});
 const config=path.join(privateDir,'config.php'),env={...process.env,SR_NEXT_CONFIG:config};
 // Add a second legal recipient/staff member only to this temporary fictitious fixture.
 const phpPrefix=`require ${JSON.stringify(path.join(root,'server/next/service.php'))}; $c=srn_config();`;
 function php(code){return execFileSync('php',['-r',phpPrefix+code],{env,encoding:'utf8',maxBuffer:15*1024*1024});}
 php(`unset($c['keyBytes']);$c['staff']['other-manager@example.invalid']=['role'=>'sales_manager','entity'=>'other'];$c['destinations']['other']=['enabled'=>true,'name'=>'Other fictional company','topics'=>['warmtepomp'],'privacy'=>'/privacy/'];file_put_contents(${JSON.stringify(config)},'<?php return '.var_export($c,true).';');`);
 const child=spawn('php',['-S',`127.0.0.1:${port}`,'-t',root,path.join(root,'scripts/next/router.php')],{env,stdio:'ignore'});
 const state=()=>JSON.parse(php(`echo json_encode(srn_tx($c,fn(&$s)=>$s));`));
 const alter=code=>php(`srn_tx($c,function(&$s){${code}});`);
 const codeFor=(email,challenge)=>{const s=state(),m=Object.values(s.outbox).find(m=>m.to===email&&m.key==='otp:'+challenge);assert.ok(m,'OTP only available in private test fixture');return m.text.match(/\d{8}/)[0];};
 class Client{constructor(){this.cookie='';this.csrf='';this.user=null;}async boot(){const r=await fetch(base+'/api/next/?action=bootstrap',{headers:{Cookie:this.cookie}});const d=await r.json();if(r.headers.get('set-cookie'))this.cookie=r.headers.get('set-cookie').split(';')[0];this.csrf=d.csrf;this.user=d.user;return {r,d};}async post(action,data={},extra={}){const r=await fetch(base+'/api/next/?action='+action,{method:'POST',headers:{Cookie:this.cookie,Origin:base,'X-CSRF-Token':this.csrf,'Content-Type':'application/json',...extra},body:JSON.stringify(data)});if(r.headers.get('set-cookie'))this.cookie=r.headers.get('set-cookie').split(';')[0];const d=await r.json();if(d.csrf)this.csrf=d.csrf;if('user'in d)this.user=d.user;return {r,d};}async login(email,purpose='account'){await this.boot();const {r,d}=await this.post('auth-start',{email,purpose,serviceAccepted:true});assert.equal(r.status,200);const result=await this.post('auth-verify',{challenge:d.challenge,code:codeFor(email,d.challenge)});assert.equal(result.r.status,200,JSON.stringify(result.d));return result;}}
 let a,b,manager,other,agent,projectId,fileId,leadId;
 try{
  for(let i=0;i<50;i++){try{await fetch(base+'/api/next/?action=bootstrap');break;}catch{await new Promise(r=>setTimeout(r,50));}}
  await t.test('without private config online functions fail closed',async()=>{const configBackup=fs.readFileSync(config);fs.renameSync(config,config+'.hold');try{const r=await fetch(base+'/api/next/?action=bootstrap');assert.equal(r.status,503);assert.equal((await r.json()).configured,false);}finally{fs.renameSync(config+'.hold',config);}assert.ok(configBackup.length);});
  await t.test('bootstrap exposes only permitted service metadata and secure local test distinction',async()=>{a=new Client();const {r,d}=await a.boot();assert.equal(d.mode,'local');assert.equal(d.accounts,true);assert.equal(d.user,null);assert.equal(r.headers.get('cache-control'),'no-store, private');assert.match(r.headers.get('x-robots-tag'),/noindex/);assert.match(r.headers.get('set-cookie'),/HttpOnly/i);assert.match(r.headers.get('set-cookie'),/SameSite=Strict/i);assert.ok(!JSON.stringify(d).includes(state().schema+'key'));assert.equal(d.key,undefined);assert.equal(d.dir,undefined);});
  await t.test('method, origin, CSRF, content-type and request-size boundaries',async()=>{let r=await fetch(base+'/api/next/?action=project-save');assert.equal(r.status,405);assert.equal((await a.post('projects-list',{}, {Origin:'https://evil.invalid'})).r.status,403);assert.equal((await a.post('projects-list',{}, {'X-CSRF-Token':'bad'})).r.status,403);assert.equal((await a.post('projects-list',{}, {'Content-Type':'text/plain'})).r.status,415);assert.equal((await a.post('projects-list',{payload:'x'.repeat(200001)})).r.status,413);});
  await t.test('OTP is private, single-use, session-bound and rotates cookie on login',async()=>{const email='alice@example.invalid';const start=await a.post('auth-start',{email,serviceAccepted:true});assert.ok(start.d.challenge);assert.equal(start.d.code,undefined);const code=codeFor(email,start.d.challenge),oldCookie=a.cookie;const foreign=new Client();await foreign.boot();assert.equal((await foreign.post('auth-verify',{challenge:start.d.challenge,code})).r.status,401);const r=await a.post('auth-verify',{challenge:start.d.challenge,code});assert.equal(r.r.status,200);assert.notEqual(a.cookie,oldCookie);assert.equal(a.user.email,email);assert.equal((await a.post('auth-verify',{challenge:start.d.challenge,code})).r.status,401);});
  await t.test('re-requesting an OTP cancels the old queued email before cron delivery',async()=>{
    const email='retry-otp@example.invalid',client=new Client();await client.boot();
    const first=await client.post('auth-start',{email,serviceAccepted:true});
    assert.equal(first.r.status,200);
    const firstCode=codeFor(email,first.d.challenge);
    const second=await client.post('auth-start',{email,serviceAccepted:true});
    assert.equal(second.r.status,200);
    const stored=state();
    const oldMail=Object.values(stored.outbox).find(x=>x.key==='otp:'+first.d.challenge);
    assert.equal(stored.challenges[first.d.challenge],undefined,'replaced challenge is no longer valid');
    assert.equal(oldMail.state,'superseded','old code will not be picked up by mail worker');
    assert.equal(oldMail.text,'','stale code is erased from the pending queue');
    assert.equal(Object.values(stored.outbox).filter(x=>x.to===email&&x.state==='queued').length,1);
    assert.equal((await client.post('auth-verify',{challenge:first.d.challenge,code:firstCode})).r.status,401);
    const latestCode=codeFor(email,second.d.challenge);
    assert.equal((await client.post('auth-verify',{challenge:second.d.challenge,code:latestCode})).r.status,200);
   });
  await t.test('marketing email must be independently enabled, revocable and retained as consent evidence',async()=>{
   assert.equal(a.user.marketingEmail,false,'an account starts without marketing consent');
   let res=await a.post('marketing-email-set',{enabled:true,version:'2026-11-14-nivo-email-v1'});
   assert.equal(res.r.status,200);assert.equal(res.d.user.marketingEmail,true);
   let x=state().accounts[a.user.id];assert.equal(x.marketingEmail,true);assert.equal(x.marketingHistory.at(-1).entity,'NIVO Groep Holland B.V.');
   assert.equal((await a.post('marketing-email-set',{enabled:true,version:'wrong'})).r.status,400);
   res=await a.post('marketing-email-set',{enabled:false,version:'2026-11-14-nivo-email-v1'});
   assert.equal(res.r.status,200);assert.equal(res.d.user.marketingEmail,false);
   x=state().accounts[a.user.id];assert.equal(x.marketingEmail,false);assert.equal(x.marketingHistory.at(-1).enabled,false);
   const exported=(await a.post('account-export')).d.account;
   assert.equal(exported.marketingEmail,false);assert.equal(exported.marketingHistory.length,2);
  });
  await t.test('optional contact profile is encrypted, OTP-gated, editable, exportable and never a lead',async()=>{
   const testEmail='profile@example.invalid';
   const contact={fullName:'Testpersoon Voorbeeld',phone:'06 1234 5678',street:'Voorbeeldstraat',houseNumber:'12A',postalCode:'1234 AB',city:'Voorbeeldstad'};
   const client=new Client();await client.boot();
   const before=Object.values(state().accounts).length;
   const begun=await client.post('auth-start',{email:testEmail,serviceAccepted:true,profile:contact,marketingEmailOptIn:false});
   assert.equal(begun.r.status,200);
   assert.equal(Object.values(state().accounts).length,before,'profile must not create an unverified account');
   assert.equal(Object.values(state().leads).length,0,'registration is never a lead');
   const received=await client.post('auth-verify',{challenge:begun.d.challenge,code:codeFor(testEmail,begun.d.challenge)});
   assert.equal(received.r.status,200);
   assert.equal(client.user.marketingEmail,false);
   assert.deepEqual(client.user.profile,contact);
   let exported=(await client.post('account-export')).d.account;
   assert.deepEqual(exported.profile,contact);
   assert.equal(exported.profileVersion,'2026-11-16-optional-profile-v1');
   const forged=await client.post('account-profile-set',{profile:{fullName:'QA',phone:'<script>alert(1)</script>'}});
   assert.equal(forged.r.status,400,'invalid contact data must fail closed');
   const changed=await client.post('account-profile-set',{profile:{fullName:'Nieuwe testnaam',city:'Voorbeeldstad'}});
   assert.equal(changed.r.status,200);
   assert.deepEqual(changed.d.user.profile,{fullName:'Nieuwe testnaam',city:'Voorbeeldstad'});
   exported=(await client.post('account-export')).d.account;
   assert.deepEqual(exported.profile,changed.d.user.profile);
   assert.equal(Object.values(state().leads).length,0);
   const outsider=new Client();await outsider.boot();
   const denied=await outsider.post('account-profile-set',{profile:contact});
   assert.equal(denied.r.status,401,'other anonymous account cannot edit contact profile');
   const deletion=await client.post('account-delete',{confirm:'VERWIJDER'});
   assert.equal(deletion.r.status,200);
   assert.equal(Object.values(state().accounts).some(u=>u.email===testEmail),false,'profile must delete with account');
  });
  await t.test('wrong codes and expired challenges fail without exposing account existence',async()=>{const c=new Client();await c.boot();const r=await c.post('auth-start',{email:'wrong@example.invalid',serviceAccepted:true});for(let i=0;i<5;i++)assert.equal((await c.post('auth-verify',{challenge:r.d.challenge,code:'00000000'})).r.status,401);assert.equal((await c.post('auth-verify',{challenge:r.d.challenge,code:codeFor('wrong@example.invalid',r.d.challenge)})).r.status,401);const ex=await c.post('auth-start',{email:'expired@example.invalid',serviceAccepted:true});alter(`$s['challenges']['${ex.d.challenge}']['expires']=time()-1;`);assert.equal((await c.post('auth-verify',{challenge:ex.d.challenge,code:'12345678'})).r.status,401);});
  await t.test('cloud plans are server-whitelisted and optimistic revisions prevent overwrite',async()=>{const q=P.newProject('Private plan',['isolatie']);projectId=q.id;q.email='MUST_NOT_SURVIVE';q.income=90000;q.measures[0].details.bsn='MUST_NOT_SURVIVE';const r=await a.post('project-save',{data:{app:'SubsidieReadyPlan',schemaVersion:3,projects:[q]},revision:0});assert.equal(r.r.status,200);assert.equal(r.d.revision,1);assert.ok(!JSON.stringify(r.d).includes('MUST_NOT_SURVIVE'));assert.equal((await a.post('project-save',{data:{app:'SubsidieReadyPlan',schemaVersion:3,projects:[q]},revision:0})).r.status,409);const read=await a.post('project-get',{id:projectId});assert.equal(read.d.revision,1);});
  await t.test('G1: PV construction and completed checks survive cloud save and another browser session',async()=>{
   const pv=P.newProject('Fictieve PV-woning',['zonnepanelen']);
   pv.measures[0]=P.measure({...pv.measures[0],details:{...pv.measures[0].details,specialConstruction:'yes'}});
   P.setCheck(pv,pv.measures[0],'own_review',true);
   assert.equal(P.checked(pv,pv.measures[0],'own_review'),true);
   const payload=data=>({app:'SubsidieReadyPlan',schemaVersion:3,projects:[data]});
   const saved=await a.post('project-save',{data:payload(pv),revision:0});
   assert.equal(saved.r.status,200,JSON.stringify(saved.d));
   assert.equal(saved.d.data.projects[0].measures[0].details.specialConstruction,'yes','PV answer must not disappear on server');
   const otherBrowser=new Client();await otherBrowser.login('alice@example.invalid');
   const reopened=await otherBrowser.post('project-get',{id:pv.id});
   assert.equal(reopened.r.status,200);
   const restored=P.envelope(reopened.d.data).projects[0];
   assert.deepEqual(restored.measures[0].details,pv.measures[0].details,'server must keep canonical browser detail fields');
   assert.equal(P.checked(restored,restored.measures[0],'own_review'),true,'unchanged checklist must stay checked');
   restored.title='Fictieve PV-woning — vervolg';
   const changed=await otherBrowser.post('project-save',{data:payload(restored),revision:reopened.d.revision});
   assert.equal(changed.r.status,200);
   assert.equal(changed.d.revision,2);
   assert.equal((await a.post('project-save',{data:payload(pv),revision:1})).r.status,409,'old browser cannot overwrite a newer revision');
   const exported=await otherBrowser.post('account-export');
   assert.equal(exported.d.projects.some(x=>x.projects?.[0]?.id===pv.id&&x.projects[0].measures[0].details.specialConstruction==='yes'),true);
   assert.equal((await otherBrowser.post('project-delete',{id:pv.id,confirm:'VERWIJDER'})).r.status,200);
   assert.equal((await a.post('project-get',{id:pv.id})).r.status,404);
  });
  await t.test('two real test accounts cannot read change or delete each other’s plans',async()=>{b=new Client();await b.login('bob@example.invalid');for(const action of ['project-get','project-delete','files-list'])assert.equal((await b.post(action,{id:projectId,confirm:'VERWIJDER'})).r.status,404);const q=P.newProject('attack',['isolatie']);q.id=projectId;assert.equal((await b.post('project-save',{data:{app:'SubsidieReadyPlan',schemaVersion:3,projects:[q]},revision:1})).r.status,404);assert.equal((await b.post('projects-list')).d.projects.length,0);});
  await t.test('demo plans cannot silently become real cloud dossiers',async()=>{assert.equal((await a.post('project-save',{data:{app:'SubsidieReadyPlan',schemaVersion:3,projects:[P.sample()]},revision:0})).r.status,400);});
  await t.test('upload requires ownership and explicit choice, then preserves exact bytes under encryption',async()=>{const {PDFDocument}=require('../vendor/pdf-lib-1.17.1.min.js'),pdf=await PDFDocument.create();pdf.addPage().drawText('FICTIEF TEST');const bytes=await pdf.save();const mid=(await a.post('project-get',{id:projectId})).d.data.projects[0].measures[0].id;
   async function upload(client,choice,blob=bytes,name='factuur-FICTIEF.pdf'){const fd=new FormData();fd.append('project',projectId);fd.append('measure',mid);fd.append('onlineChoice',choice);fd.append('revision','1');fd.append('file',new Blob([blob],{type:'application/pdf'}),name);const r=await fetch(base+'/api/next/?action=file-upload',{method:'POST',headers:{Cookie:client.cookie,Origin:base,'X-CSRF-Token':client.csrf},body:fd});return {r,d:await r.json()};}
   assert.equal((await upload(b,'yes')).r.status,403);assert.equal((await upload(a,'no')).r.status,400);assert.equal((await upload(a,'yes',Buffer.from('fake PDF'))).r.status,400);const u=await upload(a,'yes');assert.equal(u.r.status,200,JSON.stringify(u.d));fileId=u.d.file.id;assert.equal(u.d.file.scan,'local_test_only');assert.equal(u.d.revision,2);const updated=await a.post('project-get',{id:projectId});assert.equal(updated.d.revision,2);assert.deepEqual(updated.d.data.projects[0].measures[0].checks,[]);assert.equal((await upload(a,'yes')).r.status,409);let r=await fetch(base+'/api/next/?action=file-download',{method:'POST',headers:{Cookie:a.cookie,Origin:base,'X-CSRF-Token':a.csrf,'Content-Type':'application/json'},body:JSON.stringify({id:fileId})});assert.equal(r.status,200);assert.match(r.headers.get('content-disposition'),/attachment/);assert.deepEqual(Buffer.from(await r.arrayBuffer()),Buffer.from(bytes));assert.equal((await b.post('file-download',{id:fileId})).r.status,404);const raw=fs.readFileSync(path.join(privateDir,'files',fileId+'.bin'));assert.ok(!raw.includes(Buffer.from('%PDF')));});
  await t.test('file deletion requires current evidence revision and does not expose another owner',async()=>{assert.equal((await b.post('file-delete',{id:fileId,revision:2})).r.status,404);assert.equal((await a.post('file-delete',{id:fileId,revision:1})).r.status,409);assert.ok(state().files[fileId]);});
  await t.test('cross-site bootstrap and released-production config remain fail-closed',async()=>{assert.equal((await fetch(base+'/api/next/?action=bootstrap',{headers:{'Sec-Fetch-Site':'cross-site'}})).status,403);const original=fs.readFileSync(config);try{php(`unset($c['keyBytes']);$c['mode']='staging';$c['origin']='https://subsidieready.nl';$c['privacy_reviewed']=true;file_put_contents(${JSON.stringify(config)},'<?php return '.var_export($c,true).';');`);assert.equal((await fetch(base+'/api/next/?action=bootstrap')).status,503);}finally{fs.writeFileSync(config,original);}});
  await t.test('encrypted state contains no visible email or personal plan text',()=>{const bytes=fs.readFileSync(path.join(privateDir,'state.bin'));assert.equal(bytes.subarray(0,4).toString(),'SRN2');for(const t of ['alice@example.invalid','Private plan','factuur-FICTIEF'])assert.equal(bytes.includes(Buffer.from(t)),false);});
  await t.test('reminders are explicit and cancellation suppresses queued mail',async()=>{assert.equal((await a.post('reminder-set',{project:projectId,date:'2026-02-30',enabled:true})).r.status,400);const due=new Date().toISOString().slice(0,10);assert.equal((await a.post('reminder-set',{project:projectId,date:due,enabled:true})).r.status,200);execFileSync('php',['scripts/next/maintenance.php'],{cwd:root,env,stdio:'pipe'});assert.ok(Object.values(state().outbox).some(x=>x.type==='reminder'));await a.post('reminders-off');const messages=JSON.parse(execFileSync('php',['scripts/next/mail-worker.php','--local-inbox'],{cwd:root,env,encoding:'utf8'}));assert.ok(messages.every(x=>x.type!=='reminder'));});
  await t.test('guest advice has strict schema and no implied account/marketing consent',async()=>{const guest=new Client();await guest.boot();const lead={destination:'testbedrijf',topic:'thuisbatterij',name:'Fictieve klant',email:'requester@example.invalid',phone:'',channel:'email',area:'1234',timeline:'orientation',note:'Geen dossierdata',contactRequested:true,requestId:'request-test-01'};assert.equal((await guest.post('lead-create',{...lead,income:60000})).r.status,400);assert.equal((await guest.post('lead-create',{...lead,contactRequested:false})).r.status,400);assert.equal((await guest.post('lead-create',{...lead,destination:'external'})).r.status,400);const r=await guest.post('lead-create',lead);assert.equal(r.r.status,200);leadId=r.d.id;assert.equal((await guest.post('lead-create',lead)).d.id,leadId);assert.ok(!Object.values(state().accounts).some(a=>a.email===lead.email));assert.equal(state().leads[leadId].status,'pending');await guest.login(lead.email,'requests');assert.equal(guest.user,null);const own=await guest.post('requests-list');assert.equal(own.d.requests.length,1);assert.equal(own.d.requests[0].status,'new');assert.ok(!Object.values(state().accounts).some(a=>a.email===lead.email));});
  await t.test('sales access is role/entity scoped and never provides private project content',async()=>{manager=new Client();await manager.login('manager@example.invalid');other=new Client();await other.login('other-manager@example.invalid');agent=new Client();await agent.login('verkoper@example.invalid');assert.equal((await a.post('sales-list')).r.status,403);assert.equal((await other.post('sales-list')).d.leads.length,0);assert.equal((await agent.post('sales-list')).d.leads.length,0);const r=await manager.post('sales-list');assert.equal(r.d.leads.length,1);assert.equal(r.d.leads[0].id,leadId);assert.ok(!JSON.stringify(r.d).includes('Private plan'));assert.equal((await manager.post('project-get',{id:projectId})).r.status,404);assert.equal((await other.post('sales-update',{id:leadId,status:'qualified'})).r.status,404);});
  await t.test('assignment cannot cross entities and agents cannot export all leads',async()=>{assert.equal((await manager.post('sales-update',{id:leadId,status:'qualified',assigned:'other-manager@example.invalid'})).r.status,403);assert.equal((await manager.post('sales-update',{id:leadId,status:'qualified',assigned:'verkoper@example.invalid'})).r.status,200);assert.equal((await agent.post('sales-list')).d.leads.length,1);assert.equal((await agent.post('sales-export')).r.status,403);assert.equal((await agent.post('sales-update',{id:leadId,status:'appointment',note:'Fictieve afspraak'})).r.status,200);assert.equal((await manager.post('sales-export')).d.leads[0].status,'appointment');});
  await t.test('withdrawal is binding and cannot be undone by a salesperson',async()=>{const guest=new Client();await guest.login('requester@example.invalid','requests');assert.equal((await b.post('request-revoke',{id:leadId})).r.status,404);assert.equal((await guest.post('request-revoke',{id:leadId})).r.status,200);assert.equal((await manager.post('sales-update',{id:leadId,status:'new'})).r.status,409);});
  await t.test('snapshot and restore into a new private directory preserve encrypted files',()=>{const snap=path.join(dir,'snapshot'),restore=path.join(dir,'restored');const result=JSON.parse(execFileSync('php',['scripts/next/snapshot.php','--to='+snap],{cwd:root,env,encoding:'utf8'}));assert.equal(result.encrypted,true);assert.equal(result.keyIncluded,false);const r=JSON.parse(execFileSync('php',['scripts/next/restore.php','--from='+snap,'--to='+restore],{cwd:root,env,encoding:'utf8'}));assert.equal(r.restored,true);assert.ok(fs.existsSync(path.join(restore,'files',fileId+'.bin')));assert.ok(!fs.readFileSync(path.join(snap,'manifest.json'),'utf8').includes('alice@example.invalid'));const restoredEnv={...env,SR_NEXT_CONFIG:path.join(restore,'config.php')};const restored=JSON.parse(execFileSync('php',['-r',phpPrefix+'echo json_encode(srn_tx($c,fn(&$s)=>$s));'],{env:restoredEnv,encoding:'utf8'}));assert.ok(restored.projects[projectId]);});
  await t.test('account deletion removes owned projects files challenges sessions and queued email',async()=>{const id=a.user.id;const r=await a.post('account-delete',{confirm:'VERWIJDER'});assert.equal(r.r.status,200);const s=state();assert.equal(s.accounts[id],undefined);assert.equal(s.projects[projectId],undefined);assert.equal(s.files[fileId],undefined);assert.equal(fs.existsSync(path.join(privateDir,'files',fileId+'.bin')),false);assert.ok(Object.values(s.sessions).every(x=>x.account!==id));assert.ok(Object.values(s.outbox).every(x=>x.to!=='alice@example.invalid'));assert.equal((await a.post('projects-list')).r.status,403);});
  await t.test('NIVO Portal queues explicit NAW advice immediately, without OTP, account or marketing consent',async()=>{
   const guest=new Client();await guest.boot();
   const email='portal-requester@example.invalid';
   const profile={purpose:'portal',privacyVersion:'2026-11-16-nivo-portal-v2',contactRequested:true,submissionId:'26fe9110-bdc1-4b41-8d3a-3f8ec47a24c1',website:'',email,name:'Fictieve Aanvrager',topic:'thuisbatterij',channel:'phone',phone:'0612345678',street:'Voorbeeldstraat',houseNumber:'12A',postalCode:'1234 AB',city:'Teststad',timeline:'3months',note:'Fictieve technische vraag, geen documenten'};
   alter("$s['limits']=[];");
   const beforeAccounts=Object.keys(state().accounts).length;
   const beforeLeads=Object.keys(state().leads).length;
   const beforeChallenges=Object.keys(state().challenges).length;
   const portalMessages=()=>Object.values(state().outbox).filter(m=>m.type==='portal'&&m.to==='portal@nivogroepholland.nl');
   const initial=portalMessages().length;
   const invalid=[
     {...profile,contactRequested:false},{...profile,privacyVersion:'oud'},
     {...profile,income:85000},{...profile,channel:'sms'},
     {...profile,phone:''},{...profile,postalCode:'1234'},
     {...profile,street:''},{...profile,houseNumber:''},{...profile,city:''},
     {...profile,topic:'lening'},{...profile,website:'https://bot.invalid'},
     {...profile,submissionId:'bad-key'},{...profile,email:'bad-email'},
     {...profile,name:'<script>alert(1)</script>'}
   ];
   for(const candidate of invalid){
     const bad=await guest.post('portal-submit',candidate);
     assert.equal(bad.r.status,400,JSON.stringify(candidate));
   }
   assert.equal(portalMessages().length,initial,'invalid data never reaches NIVO');
   assert.equal((await guest.post('portal-submit',profile,{'X-CSRF-Token':'wrong'})).r.status,403,'CSRF is still required');
   assert.equal((await guest.post('auth-start',profile)).r.status,400,'legacy OTP purpose is disabled');
   const submitted=await guest.post('portal-submit',profile);
   assert.equal(submitted.r.status,200,JSON.stringify(submitted.d));
   assert.equal(submitted.d.portalQueued,true);
   assert.match(submitted.d.reference,/^SR-[0-9A-F]{16}$/);
   assert.equal(Object.keys(state().accounts).length,beforeAccounts,'no account created');
   assert.equal(Object.keys(state().leads).length,beforeLeads,'native sales records untouched');
   assert.equal(Object.keys(state().challenges).length,beforeChallenges,'no email verification challenge');
   assert.equal(portalMessages().length,initial+1,'one direct request queues one mail');
   const replay=await guest.post('portal-submit',profile);
   assert.equal(replay.r.status,200);
   assert.equal(replay.d.reference,submitted.d.reference,'network retry is idempotent');
   assert.equal(portalMessages().length,initial+1,'retry does not queue duplicate');
   const mail=portalMessages().find(m=>m.meta.request&&submitted.d.reference.endsWith(m.meta.request.slice(0,16).toUpperCase()));
   assert.ok(mail&&mail.state==='queued');
   assert.ok(mail.key.startsWith('portal:'));
   const payloadText=mail.text.split('BEGIN_SUBSIDIEREADY_PORTAL_JSON')[1]?.split('END_SUBSIDIEREADY_PORTAL_JSON')[0]?.trim();
   assert.ok(payloadText,'versioned machine-readable portal envelope');
   const parsed=JSON.parse(payloadText);
   assert.equal(parsed.schema,'subsidieready.nivo.portal.request.v2');
   assert.equal(parsed.receiver,'portal@nivogroepholland.nl');
   assert.equal(parsed.email,email);
   assert.equal(parsed.email_verified,false);
   assert.equal(parsed.verified_email,undefined);
   assert.deepEqual(parsed.address,{street:'Voorbeeldstraat',house_number:'12A',postal_code:'1234AB',city:'Teststad'});
   assert.equal(parsed.topic,'thuisbatterij');
   assert.equal(parsed.preferred_channel,'phone');
   assert.equal(parsed.phone,'0612345678');
   assert.equal(parsed.postcode_area,'1234');
   assert.equal(parsed.marketing_opt_in,false);
   assert.equal(parsed.contact_requested,true);
   assert.equal(parsed.verification_method,'none');
   assert.equal(parsed.request_text_version,profile.privacyVersion);
   assert.equal(parsed.request_id,submitted.d.reference);
   assert.ok(parsed.contact_consent_at_utc);
   assert.ok(!mail.text.includes('MUST_NOT_SURVIVE'));
   // Per-address throttling is independent from session idempotency.
   for(let n=2;n<=3;n++){
     const next=await guest.post('portal-submit',{...profile,submissionId:'26fe9110-bdc1-4b41-8d3a-3f8ec47a24c'+n});
     assert.equal(next.r.status,200,JSON.stringify(next.d));
   }
   const limited=await guest.post('portal-submit',{...profile,submissionId:'26fe9110-bdc1-4b41-8d3a-3f8ec47a24c4'});
   assert.equal(limited.r.status,429,'more than three hourly requests per address is blocked');
  });
  await t.test('internal config and implementation files are not reachable through the development router',async()=>{for(const p of ['/server/next/service.php','/scripts/next/setup.php','/.env','/.git/config','/tests/next-server.test.cjs'])assert.equal((await fetch(base+p)).status,404);});
 }finally{child.kill();await new Promise(r=>setTimeout(r,80));fs.rmSync(dir,{recursive:true,force:true});}
});
