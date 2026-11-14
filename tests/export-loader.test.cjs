'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const code=fs.readFileSync(require.resolve('../assets/export-loader.js'),'utf8');
function setup({offline=false,preloaded=false}={}) {
  const scripts=[],timers=new Map();let timerId=0;
  const globals={'/vendor/pdf-lib-1.17.1.min.js':'PDFLib','/vendor/fontkit-1.1.1.min.js':'fontkit','/vendor/noto-sans-font.js':'SK_FONT_BASE64','/vendor/jszip-3.10.1.min.js':'JSZip'};
  const sandbox={Map,Promise,Error,Object,setTimeout(fn){timers.set(++timerId,fn);return timerId;},clearTimeout(id){timers.delete(id);},document:{
    documentElement:{dataset:{offline:String(offline)}},
    createElement(tag){assert.equal(tag,'script');return {remove(){this.removed=true;}};},
    head:{appendChild(script){scripts.push(script);}}
  }};
  sandbox.window=sandbox;
  if(preloaded)for(const key of Object.values(globals))sandbox[key]={};
  vm.runInNewContext(code,sandbox);
  const succeed=script=>{assert.ok(globals[script.src],'only a fixed local library may load');sandbox[globals[script.src]]={};script.onload();};
  return {scripts,timers,api:sandbox.SRExportLoader,succeed};
}
test('export loader: startup does not load scripts; simultaneous downloads share local requests',async()=>{
  const f=setup();assert.equal(f.scripts.length,0);
  const first=f.api.ensure('pdf'),second=f.api.ensure('zip');
  assert.equal(f.scripts.length,4);assert.equal(new Set(f.scripts.map(s=>s.src)).size,4);
  f.scripts.forEach(f.succeed);await Promise.all([first,second]);
  await f.api.ensure('zip');assert.equal(f.scripts.length,4);assert.equal(f.timers.size,0);
});
test('export loader: PDF requests do not load ZIP; failure retains successful libraries and retries',async()=>{
  const f=setup(),first=f.api.ensure('pdf');assert.equal(f.scripts.length,3);
  const failed=f.scripts[1];f.scripts.filter(s=>s!==failed).forEach(f.succeed);failed.onerror();
  await assert.rejects(first,/Je gegevens blijven behouden/);assert.equal(failed.removed,true);
  const retry=f.api.ensure('pdf');assert.equal(f.scripts.length,4);assert.equal(f.scripts.at(-1).src,failed.src);
  f.succeed(f.scripts.at(-1));await retry;assert.equal(f.timers.size,0);
});
test('export loader: a timeout is recoverable without a permanent rejected promise',async()=>{
  const f=setup(),first=f.api.ensure('pdf');
  f.succeed(f.scripts[0]);f.succeed(f.scripts[1]);
  [...f.timers.values()][0]();await assert.rejects(first,/probeer opnieuw/);
  const retry=f.api.ensure('pdf');f.succeed(f.scripts.at(-1));await retry;
});
test('export loader: portable builds use embedded dependencies and never fetch missing ones',async()=>{
  const ready=setup({offline:true,preloaded:true});await ready.api.ensure('zip');assert.equal(ready.scripts.length,0);
  const missing=setup({offline:true});await assert.rejects(missing.api.ensure('pdf'),/offline bestand/);assert.equal(missing.scripts.length,0);
});
test('export loader: arbitrary input cannot become a script URL',async()=>{
  const f=setup();for(const value of ['https://example.invalid/a.js','project','__proto__',null])await assert.rejects(f.api.ensure(value),/Onbekende/);
  assert.equal(f.scripts.length,0);
});
