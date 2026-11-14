'use strict';
const test=require('node:test'), assert=require('node:assert/strict'), fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=()=>read('regelingen/index.html');const js=()=>read('assets/regelingen-app.js');const css=()=>read('assets/regelingen.css');
test('single-page dashboard renders three connected panels and mobile tabs',()=>{
 const h=html();for(const id of ['r-panel-selection','r-panel-results','r-panel-details','route-detail','result','r-mobile-next','scan','scan-fields'])assert.ok(h.includes(`id="${id}"`),id);
 for(const k of ['selection','results','details'])assert.match(h,new RegExp(`data-panel="${k}"`));
 assert.match(h,/class="r-dashboard"/);assert.doesNotMatch(h,/class="hero"|class="results"|class="cards"/);
});
test('selection immediately recomputes local results and never navigates to a results page',()=>{
 const s=js();assert.ok(s.includes("form.addEventListener('change',onChange)"));assert.ok(s.includes('snapshot=engine.evaluate(x)'));assert.ok(s.includes('snapshot=null'));assert.ok(s.includes('renderList();buildPrint()'));assert.doesNotMatch(s,/scrollIntoView|location\.(?:href|assign)|history\.(?:pushState|replaceState)/);
});
test('visible desktop viewport remains fixed; only internal dashboard panels scroll',()=>{
 const s=css();assert.match(s,/body\.r-dashboard-ready\{overflow:hidden\}/);assert.match(s,/height:var\(--r-viewport-height/);assert.match(s,/\.r-route-list\{[^}]*overflow:auto/);assert.match(s,/\.r-route-detail\{[^}]*overflow:auto/);assert.match(s,/@media\(max-width:1020px\)/);assert.match(s,/data-active-panel="details"/);
});
test('subsidy VAT loan and local stay distinct, with attributable official source links',()=>{
 const s=js();for(const kind of ['subsidie','btw','financiering','lokaal'])assert.ok(s.includes(kind));assert.ok(s.includes('r-loan-warning'));assert.ok(s.includes('r.sources.map'));assert.ok(s.includes('noopener noreferrer'));assert.ok(s.includes('Geen automatische goedkeuring.'));
});
test('route details are selectable without exposing unsanitized answers',()=>{
 const s=js();assert.match(s,/const esc=v=>String\(/);assert.ok(s.includes('selectedId=btn.dataset.route'));assert.ok(s.includes("data-route="));assert.ok(s.includes("aria-pressed"));assert.doesNotMatch(s,/innerHTML\s*=\s*(?:r\.reason|r\.summary|r\.title)/);
});
test('interactive checker remains memory-only, independent of cloud and marketing',()=>{
 const s=js();assert.doesNotMatch(s,/\b(?:fetch|XMLHttpRequest|sendBeacon|WebSocket|localStorage|sessionStorage|indexedDB|SRMetrics)\b/);assert.doesNotMatch(s,/new\s+Image\(|navigator\.sendBeacon|navigator\.serviceWorker/);assert.ok(s.includes('JSON.stringify(snapshot,null,2)'));
});
test('no JavaScript cannot submit user choices or automatically create an online lead',()=>{
 const h=html();assert.match(h,/id="scan-fields" disabled/);assert.match(h,/<noscript>/);assert.doesNotMatch(h,/<input[^>]+type="(?:email|password|tel|file)"/);assert.doesNotMatch(h,/name="(?:income|bsn|address|phone|email)"/);
});
test('one-off handoff is inside the dashboard, without a second page or auto-sync',()=>{
 const h=html(),build=read('scripts/next/build.cjs'),bridge=read('assets/plan-bridge.js');assert.equal((h.match(/id="use-in-plan"/g)||[]).length,1);assert.ok(h.includes('id="plan-bridge-status"'));assert.doesNotMatch(h,/Maak hiervan je eigen plan<\/h2>/);assert.ok(build.includes('Do not append a scrolling legacy handoff section'));assert.ok(bridge.includes("b.addEventListener('click'"));assert.ok(bridge.includes("location.assign('/mijn-plan/')"));assert.ok(bridge.includes('form')||bridge.includes('FormData(f)'));
});
test('print/export use a snapshot, never append financing to cash savings',()=>{
 const s=js();assert.ok(s.includes('snapshot.routes.map'));assert.ok(s.includes('if(snapshot)window.print()'));assert.ok(s.includes('URL.revokeObjectURL'));assert.ok(s.includes('Een lening moet worden terugbetaald'));assert.doesNotMatch(s,/totalSavings|estimatedGrant|sumBenefit/);
});
