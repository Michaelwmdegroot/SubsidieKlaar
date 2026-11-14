const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
global.window=global;
global.PDFLib=require('../vendor/pdf-lib-1.17.1.min.js');
global.fontkit=require('../vendor/fontkit-1.1.1.min.js');
global.JSZip=require('../vendor/jszip-3.10.1.min.js');
global.SKCore=require('../assets/core.js');
require('../vendor/noto-sans-font.js');
require('../assets/export.js');
function fixture(){return {...SKCore.initialState(),ownerType:'owner_occupier',installed:'yes',newDevice:'yes',installerBusiness:'yes',pumpType:'air_water',buildingRoute:'before2019',purchaseDate:'2026-08-01',installDate:'2026-09-01',applicantName:'Zoë van der Veen',installationAddress:'Teststraat 10',installationPostcode:'1234 AB',installationCity:'Leiden',installerName:'Test Installateur',installerAddress:'Testweg 1, Leiden',installerContact:'André',installerPhone:'0711234567',brand:'Testmerk',model:'Testtype',productRoute:'known_code',meldcode:'KA-TEST',codeConfirmed:true,amount:'1000.00',payments:[{date:'2026-09-02',amount:'1000.00'}],invoiceConfirmed:true,paymentConfirmed:true};}
function doc(category,name,bytes){return{id:category,category,name,size:bytes.length,type:'application/pdf',file:{arrayBuffer:async()=>Uint8Array.from(bytes).buffer}};}
test('PDF is readable, paginated and carries an explicit demo title',async()=>{
 const s=fixture(),d=[doc('invoice','factuur.pdf',Buffer.from('%PDF-test')),doc('payment','betaling.pdf',Buffer.from('%PDF-payment'))],r=SKCore.evaluate(s,d,{today:'2026-11-13'});
 const bytes=await SKExport.pdf(s,d,r,{demo:true});
 assert.equal(Buffer.from(bytes).subarray(0,5).toString(),'%PDF-');
 const parsed=await PDFLib.PDFDocument.load(bytes);assert.ok(parsed.getPageCount()>=2);assert.match(parsed.getTitle(),/VOORBEELD/);
});
test('ZIP retains exact original bytes, uses safe paths, and stores project plus review',async()=>{
 const s=fixture(),original=Buffer.from('%PDF-1.4\nORIGINAL PRIVATE EVIDENCE\n'),d=[doc('invoice','../../bewijs.pdf',original),doc('payment','betaalbewijs.pdf',original)],r=SKCore.evaluate(s,d,{today:'2026-11-13'});
 const project={app:'SubsidieReady',schemaVersion:1,state:s};
 const z=await JSZip.loadAsync(await SKExport.zip(s,d,r,project));
 const names=Object.keys(z.files);assert.ok(names.includes('01-Documentenoverzicht.pdf'));assert.ok(names.includes('02-Documentenoverzicht.html'));
 assert.ok(!names.some(n=>n.split('/').includes('..')));
 const manifest=JSON.parse(await z.file('04-Bestandenindex.json').async('string'));assert.equal(manifest.files.length,2);
 for(const file of manifest.files)assert.deepEqual(Buffer.from(await z.file(file.archivePath).async('uint8array')),original);
 assert.equal(JSON.parse(await z.file('03-SubsidieReady-project.json').async('string')).state.applicantName,'Zoë van der Veen');
});
test('HTML report escapes user text and retains the full original Unicode value',()=>{
 const s=fixture();s.notes='<script>alert("x")</script> 李';
 const h=SKExport.html(s,[],SKCore.evaluate(s,[],{today:'2026-11-13'}));
 assert.ok(!h.includes('<script>'));assert.ok(h.includes('&lt;script&gt;'));assert.ok(h.includes('李'));
});
test('no runtime code calls a remote AI/upload/analytics endpoint',()=>{
 const app=fs.readFileSync(require.resolve('../assets/app.js'),'utf8');
 assert.doesNotMatch(app,/\b(?:fetch|XMLHttpRequest|sendBeacon|WebSocket)\s*\(/);
});
test('ZIP snapshots data before async PDF work, retaining a consistent project and HTML',async()=>{
 const s=fixture(),original=Buffer.from('%PDF-1.4\nSNAPSHOT\n'),d=[doc('invoice','before.pdf',original)],r=SKCore.evaluate(s,d,{today:'2026-11-14'});
 const project={app:'SubsidieReady',schemaVersion:1,state:s};
 const pending=SKExport.zip(s,d,r,project);s.applicantName='MUTATED AFTER START';d[0].name='after.pdf';d.push(doc('payment','extra.pdf',original));
 const z=await JSZip.loadAsync(await pending);
 assert.equal(JSON.parse(await z.file('03-SubsidieReady-project.json').async('string')).state.applicantName,'Zoë van der Veen');
 const html=await z.file('02-Documentenoverzicht.html').async('string');assert.ok(!html.includes('MUTATED AFTER START'));assert.ok(html.includes('before.pdf'));assert.ok(!html.includes('after.pdf'));
 const manifest=JSON.parse(await z.file('04-Bestandenindex.json').async('string'));assert.equal(manifest.files.length,1);assert.equal(manifest.files[0].originalName,'before.pdf');
});
