'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');

test('NIVO advice form is direct, compact and consented, without account or OTP',()=>{
 const ui=read('assets/advice-app.js'),svc=read('server/next/service.php'),worker=read('scripts/next/mail-worker.php'),css=read('assets/plan.css');
 for(const field of ['name','email','phone','street','houseNumber','postalCode','city'])
  assert.match(ui,new RegExp('name="'+field+'".*required'));
 assert.match(ui,/name="contactRequested" required/);
 assert.match(ui,/portal-submit/);
 assert.match(ui,/submissionId/);
 assert.match(ui,/NIVO Groep Holland B\.V\./);
 assert.match(ui,/Zonder account|zonder account|geen account/i);
 assert.doesNotMatch(ui,/auth-start|auth-verify|renderVerify|portal-code-form|marketingEmailOptIn|localStorage|sessionStorage|thuisbatterijteam\.nl/);
 assert.match(css,/NIVO direct-lead form V2/);
 assert.match(css,/sr-lead-grid/);
 assert.match(svc,/SRN_PORTAL_MAILBOX='portal@nivogroepholland\.nl'/);
 assert.match(svc,/if\(\$action==='portal-submit'\)/);
 assert.match(svc,/srn_queue\(\$s,SRN_PORTAL_MAILBOX,'portal'/);
 assert.match(svc,/BEGIN_SUBSIDIEREADY_PORTAL_JSON/);
 assert.match(svc,/contact_requested.*true/);
 assert.match(svc,/email_verified.*false/);
 assert.match(svc,/verification_method.*'none'/);
 assert.doesNotMatch(svc,/if\(\$ch\['purpose'\]==='portal'\)/);
 assert.match(worker,/SubsidieReady \| Nieuwe adviesaanvraag/);
 assert.doesNotMatch(worker,/Nieuwe geverifieerde adviesaanvraag/);
 assert.doesNotMatch(svc,/\$c\['leads_enabled'\]\s*=\s*true/);
});

test('only same-origin NIVO advice is linked and old TBT handoff is disabled',()=>{
 const article=read('hulp/thuisbatterij-btw/index.html'),conf=JSON.parse(read('scripts/lead-pilot.config.json'));
 assert.equal(conf.enabled,false);
 assert.match(article,/href="\/advies\/"/);
 assert.match(article,/href="\/privacy\/"/);
 assert.doesNotMatch(article,/https:\/\/thuisbatterijteam\.nl\/contact\/adviesgesprek\//);
 const html=read('advies/index.html');
 assert.match(html,/src="\/assets\/advice-app\.js"/);
 assert.match(html,/noindex/);
});
