'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');

test('NIVO advice form is voluntary and requires OTP before internal Portal mail is queued',()=>{
 const ui=read('assets/advice-app.js'),svc=read('server/next/service.php'),worker=read('scripts/next/mail-worker.php');
 assert.match(ui,/name="contactRequested" required/);
 assert.match(ui,/name="email" type="email"/);
 assert.match(ui,/purpose:'portal'/);
 assert.match(ui,/auth-verify/);
 assert.match(ui,/portalQueued/);
 assert.match(ui,/NIVO Groep Holland B\.V\./);
 assert.match(ui,/niet .*account|zonder account|Geen .*account/i);
 assert.match(svc,/SRN_PORTAL_MAILBOX='portal@nivogroepholland\.nl'/);
 assert.match(svc,/if\(\$ch\['purpose'\]==='portal'\)/);
 assert.match(svc,/srn_queue\(\$s,SRN_PORTAL_MAILBOX,'portal'/);
 assert.match(svc,/BEGIN_SUBSIDIEREADY_PORTAL_JSON/);
 assert.match(svc,/contact_requested.*true/);
 assert.match(worker,/SubsidieReady \| Nieuwe geverifieerde adviesaanvraag/);
 assert.doesNotMatch(ui,/thuisbatterijteam\.nl|mailto:portal@|marketingEmailOptIn|localStorage|sessionStorage/);
 assert.doesNotMatch(svc,/\$c\['leads_enabled'\]\s*=\s*true/);
});

test('only same-origin NIVO advice form is linked; old TBT lead handoff is disabled',()=>{
 const article=read('hulp/thuisbatterij-btw/index.html'),conf=JSON.parse(read('scripts/lead-pilot.config.json'));
 assert.equal(conf.enabled,false);
 assert.match(article,/href="\/advies\/"/);
 assert.match(article,/href="\/privacy\/"/);
 assert.doesNotMatch(article,/https:\/\/thuisbatterijteam\.nl\/contact\/adviesgesprek\//);
 const html=read('advies/index.html');
 assert.match(html,/src="\/assets\/advice-app\.js"/);
 assert.match(html,/noindex/);
});
