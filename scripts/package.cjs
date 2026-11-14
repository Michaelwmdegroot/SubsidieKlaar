'use strict';
const fs=require('node:fs'),path=require('node:path'),JSZip=require('../vendor/jszip-3.10.1.min.js');
const root=path.resolve(__dirname,'..'),dest=path.join(root,'dist');
const selected=['index.html','404.html','robots.txt','sitemap.xml','.htaccess','version.json','assets','vendor','api','admin','server','hulp','regelingen','subsidies','btw','financiering','mijn-plan','advies','sales','bronbeheer','next-version.json','privacy','bronnen','over','scripts/setup-admin.php','scripts/maintenance.php','scripts/next/setup.php','scripts/next/mail-worker.php','scripts/next/maintenance.php','scripts/next/snapshot.php','scripts/next/restore.php'];
async function main(){
 fs.rmSync(dest,{recursive:true,force:true});fs.mkdirSync(dest,{recursive:true});const zip=new JSZip(),manifest=[];
 function add(relative){
  const source=path.join(root,relative),st=fs.lstatSync(source);if(st.isSymbolicLink())throw Error('No symlinks in release: '+relative);
  if(st.isDirectory()){for(const entry of fs.readdirSync(source).sort())add(relative+'/'+entry);return;}
  const bytes=fs.readFileSync(source);zip.file(relative,bytes,{date:new Date('2026-11-14T00:00:00Z')});manifest.push(relative);
 }
 selected.forEach(add);
 if(manifest.some(f=>/(?:^|\/)(?:\.git|\.env|config\.php|rate\.json|sessions|stats)(?:\/|$)/.test(f)))throw Error('Private file in release');
 fs.writeFileSync(path.join(dest,'SubsidieReady-hostinger.zip'),await zip.generateAsync({type:'nodebuffer',compression:'DEFLATE'}));
 fs.writeFileSync(path.join(dest,'manifest.json'),JSON.stringify({product:'SubsidieReady',version:'1.0.0',files:manifest},null,2));
 console.log('Hostinger package: '+manifest.length+' files; no credentials, documents or statistics.');
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
