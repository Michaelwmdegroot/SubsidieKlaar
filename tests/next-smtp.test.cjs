'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const path=require('node:path');
const fs=require('node:fs');
const os=require('node:os');
const {execFileSync}=require('node:child_process');

const root=path.resolve(__dirname,'..');
const service=path.join(root,'server/next/service.php');
const cli=path.join(root,'scripts/next/mail-check.php');
const call=(code,env={})=>execFileSync('php',['-r',code],{
  cwd:root,env:{...process.env,...env},encoding:'utf8',stdio:['ignore','pipe','pipe']
});
const q=JSON.stringify;

test('SMTP on shared Hostinger PHP reads only private dotenv, without account activation',()=>{
 const privateDir=fs.mkdtempSync(path.join(os.tmpdir(),'sr-smtp-'));
 const config=path.join(privateDir,'next-config.php');
 try {
  fs.writeFileSync(path.join(privateDir,'.env'),
   'SMTP_HOST=smtp.hostinger.com\nSMTP_PORT=465\nSMTP_ENCRYPTION=ssl\n'+
   'SMTP_USERNAME=info@subsidieready.nl\nSMTP_PASSWORD=synthetic-app-password\n');
  fs.writeFileSync(config,'<?php return '+`[
    'mode'=>'local','origin'=>'http://127.0.0.1:9999','dir'=>${q(privateDir)},
    'key'=>str_repeat('a',64),'controller'=>'Synthetic test',
    'contact'=>'test@example.invalid','privacy_reviewed'=>false,
    'transport'=>'smtp','mail_ready'=>false,'mail_from'=>'info@subsidieready.nl',
    'accounts_enabled'=>false,'vault_enabled'=>false,'leads_enabled'=>false,'staff_enabled'=>false,
    'storage_driver'=>'file'
  ];`+'\n');
  const stdout=call('require '+q(service)+';$c=srn_config();$p=srn_smtp_profile($c);echo json_encode(['+
    '"host"=>$p["host"],"port"=>$p["port"],"security"=>$p["security"],"accounts"=>$c["accounts_enabled"]]);',
    {SR_NEXT_CONFIG:config});
  assert.deepEqual(JSON.parse(stdout),{host:'smtp.hostinger.com',port:465,security:'ssl',accounts:false});
  const out=JSON.parse(execFileSync('php',[cli,'--check'],{cwd:root,encoding:'utf8',env:{...process.env,SR_NEXT_CONFIG:config}}));
  assert.equal(out.status,'smtp_configured');
  assert.equal(out.delivery_test,'not_performed');
  assert.equal(out.accounts_enabled,false);

  fs.writeFileSync(path.join(privateDir,'.env'),
   'SMTP_HOST=smtp.hostinger.com\nSMTP_PORT=25\nSMTP_ENCRYPTION=ssl\n'+
   'SMTP_USERNAME=info@subsidieready.nl\nSMTP_PASSWORD=synthetic-app-password\n');
  const refused=call('require '+q(service)+';$c=include '+q(config)+';try{srn_smtp_profile($c);echo "unsafe";}catch(Throwable){echo "blocked";}');
  assert.equal(refused,'blocked','unencrypted/downgraded ports must fail');
  fs.writeFileSync(path.join(privateDir,'.env'),
   'SMTP_HOST=smtp.hostinger.com\nSMTP_PORT=465\nSMTP_ENCRYPTION=ssl\n'+
   'SMTP_USERNAME=info@subsidieready.nl\nSMTP_PASSWORD=\n');
  const noPassword=call('require '+q(service)+';$c=include '+q(config)+';try{srn_smtp_profile($c);echo "unsafe";}catch(Throwable){echo "blocked";}');
  assert.equal(noPassword,'blocked','missing SMTP password must fail');
 }finally{fs.rmSync(privateDir,{recursive:true,force:true});}
});

test('SMTP validates headers, protects body lines and enforces reply status',()=>{
 const code='require '+q(service)+';'+
  '$m=srn_smtp_message("info@subsidieready.nl","recipient@example.invalid","SubsidieReady code","Line\\n.Second line\\n");'+
  'if(!str_contains($m,"\\r\\n..Second line\\r\\n"))throw new Exception("dot-stuffing");'+
  'try{srn_smtp_message("info@subsidieready.nl","recipient@example.invalid","Subject\\r\\nBcc: attacker@example.invalid","Body");echo "unsafe";}catch(RuntimeException){echo "headers-safe";}'+
  '$f=fopen("php://temp","r+");fwrite($f,"250-example\\r\\n250 AUTH PLAIN LOGIN\\r\\n");rewind($f);'+
  'if(!str_contains(srn_smtp_read($f,[250]),"AUTH PLAIN"))throw new Exception("multiline");fclose($f);';
 assert.equal(call(code),'headers-safe');
});

test('OTP gets branded accessible HTML plus plaintext in one secure multipart message',()=>{
 const template=path.join(root,'server/next/mail-template.php');
 const output=call('require '+q(service)+';require '+q(template)+';'+
  '$plain="Je SubsidieReady-code is: 12345678\\nGeldig voor 10 minuten. Alleen gebruiken voor je eigen verzoek.";'+
  '$html=srn_otp_email_html($plain);'+
  '$msg=srn_smtp_message("info@subsidieready.nl","recipient@example.invalid","SubsidieReady verificatiecode",$plain,$html);'+
  '$checks=["multipart"=>str_contains($msg,"multipart/alternative"),'+
  '"text"=>str_contains($msg,"Content-Type: text/plain"),'+
  '"html"=>str_contains($msg,"Content-Type: text/html"),'+
  '"code"=>substr_count($msg,"12345678")===2,'+
  '"security"=>str_contains($html,"10 minuten")&&str_contains($html,"Deel je code nooit"),'+
  '"no_remote"=>!preg_match("~<script|<img|<link|https?://~i",$html),'+
  '"utf8"=>str_contains($msg,"charset=UTF-8"),'+
  '"auto"=>str_contains($msg,"Auto-Submitted: auto-generated")];'+
  'try{srn_otp_email_html("Geen code");$checks["reject"]=false;}catch(InvalidArgumentException){$checks["reject"]=true;}'+
  'echo json_encode($checks);');
 const checks=JSON.parse(output);
 for(const [key,ok] of Object.entries(checks))assert.equal(ok,true,key);
 const worker=fs.readFileSync(path.join(root,'scripts/next/mail-worker.php'),'utf8');
 assert.match(worker,/srn_otp_email_html/);
 assert.match(worker,/srn_smtp_send\(\$c,\$v\['to'\],\$subject,\$v\['text'\]/);
 assert.ok(!worker.includes('SMTP_PASSWORD='));
});
