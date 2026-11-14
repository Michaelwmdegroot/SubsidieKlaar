from pathlib import Path
from playwright.sync_api import sync_playwright
import json,re
root=Path(__file__).resolve().parents[2];base=(root/'qa/SubsidieReady-mijn-plan-test.html').read_text()
report={'method':'In-memory Chromium. Storage and cloud responses below are simulated UI fixtures, not actual network or native persistence. Actual PHP API has separate tests.','screens':[],'checks':[],'errors':[]}
shim='''<script>window.__kv={};Object.defineProperty(window,'localStorage',{value:{getItem:k=>Object.hasOwn(window.__kv,k)?window.__kv[k]:null,setItem:(k,v)=>window.__kv[k]=String(v),removeItem:k=>delete window.__kv[k]}});</script>'''
def render_static(route):
 h=(root/route/'index.html').read_text().replace('<html lang="nl">','<html lang="nl" data-offline="true">')
 h=re.sub(r'<link rel="stylesheet" href="([^"?]+)">',lambda m:'<style>'+(root/m[1].lstrip('/')).read_text()+'</style>',h)
 code=[]
 h=re.sub(r'<script defer src="([^"?]+)"></script>',lambda m:(code.append((root/m[1].lstrip('/')).read_text()) or ''),h)
 shim="<script>if(!crypto.randomUUID)crypto.randomUUID=()=>[...crypto.getRandomValues(new Uint8Array(16))].map(x=>x.toString(16).padStart(2,'0')).join('');</script>"
 h=h.replace('</body>',shim+''.join('<script>'+s.replace('</script','<\\/script')+'</script>' for s in code)+'</body>')
 # Static image placeholders avoid blocked origin; exact SVG brand is in earlier standalone tests.
 h=re.sub(r'<img[^>]+>', '',h);h=re.sub(r'<link rel="icon"[^>]+>','',h)
 return h
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 p=b.new_page(viewport={'width':1440,'height':1000},accept_downloads=True)
 p.on('pageerror',lambda e:report['errors'].append(str(e)));p.on('dialog',lambda d:d.accept())
 p.set_content(base.replace('<head>','<head>'+shim),wait_until='load')
 p.evaluate("() => {if(!crypto.randomUUID)crypto.randomUUID=()=>[...crypto.getRandomValues(new Uint8Array(16))].map(x=>x.toString(16).padStart(2,'0')).join('');}")
 p.locator('[data-pa=sample]').first.click();p.locator('#persist-plan').check();assert p.evaluate("JSON.parse(__kv['subsidieready.plan.v3']).projects.length")==1
 existing=p.evaluate("__kv['subsidieready.plan.v3']");p.evaluate("__kv['subsidieready.plan.v3']='changed-in-another-tab'");p.locator('[data-tab=work]').click();p.locator('[data-task=source]').check();assert p.evaluate("__kv['subsidieready.plan.v3']")=='changed-in-another-tab';assert 'conflict' in p.locator('[data-save-status]').first.inner_text()
 report['checks'].append('local storage mock: explicit opt-in and concurrent tab does not overwrite')
 # Re-open serialised plan using a fresh app instance with fake storage set beforehand.
 restored=base.replace('<head>','<head>'+shim+'<script>window.__kv='+json.dumps({'subsidieready.plan.v3':existing,'subsidieready.plan.local-choice.v1':'yes'})+';</script>')
 p.set_content(restored,wait_until='load');p.wait_for_timeout(100);assert 'Ons huis' in p.locator('.p-content').inner_text();report['checks'].append('storage mock reload reconstructs the serialised multi-measure plan')
 # Stub only account API responses, never pretend these are real email/network tests.
 cloud='''<script>window.__calls=[];window.__revision=0;window.__conflict=false;let mock={configured:true,accounts:true,mode:'local',controller:'Fictief testbedrijf',contact:'test@example.invalid',user:null};window.SRCloud={bootstrap:async()=>mock,status:()=>mock,post:async(action,data)=>{window.__calls.push({action,data});if(action==='auth-start')return{challenge:'fake',message:'Fictieve code'};if(action==='auth-verify'){mock.user={id:'user01',email:'test@example.invalid'};return{user:mock.user};}if(action==='project-save'){if(window.__conflict){const e=Error('Conflict');e.status=409;throw e;}return {revision:++window.__revision};}if(action==='projects-list')return{projects:[]};throw Error('Unexpected mock action '+action);}};</script>'''
 marker='<script>'+ (root/'assets/plan-app.js').read_text().replace('</script','<\\/script')+'</script>'
 # Offline make rewrites dynamic URLs; locate the start by a distinctive leading app source.
 ix=base.index("<script>(function(){\n 'use strict';\n const P=window.SRPlan")
 testhtml=base[:ix]+cloud+base[ix:]
 p.set_content(testhtml,wait_until='load');p.evaluate("() => {if(!crypto.randomUUID)crypto.randomUUID=()=>[...crypto.getRandomValues(new Uint8Array(16))].map(x=>x.toString(16).padStart(2,'0')).join('');}");p.wait_for_timeout(100)
 p.locator('[data-pa=new]').first.click();p.locator('#new-form [name=title]').fill('Fictief cloudplan');p.locator('#new-form [value=isolatie]').check();p.locator('#new-form button[type=submit]').click()
 assert p.evaluate('__calls.length')==0
 p.locator('[data-pa=login]').click();p.locator('#login-form [name=email]').fill('test@example.invalid');p.locator('#login-form [name=service]').check();p.locator('#login-form button[type=submit]').click();p.locator('#verify-form [name=code]').fill('12345678');p.locator('#verify-form button[type=submit]').click();p.wait_for_timeout(100)
 assert all(c['action']!='project-save' for c in p.evaluate('__calls'))
 p.locator('[data-pa=cloud-save]').click();p.wait_for_timeout(100);assert p.evaluate('__revision')==1
 p.locator('[data-tab=work]').click();p.locator('[name=area]').fill('45');p.locator('#measure-form button[type=submit]').click();p.wait_for_timeout(1100);assert p.evaluate('__revision')==2
 p.evaluate('__conflict=true');p.locator('[name=area]').fill('46');p.locator('#measure-form button[type=submit]').click();p.wait_for_timeout(1100);assert 'Synchronisatieconflict' in p.locator('[data-save-status]').first.inner_text();assert p.locator('[name=area]').input_value()=='46'
 report['checks'].append('mock cloud: login alone does not save, explicit choice enables autosave, conflict preserves local edits')
 for route in ['advies','bronbeheer','hulp/isolatie-checklist','hulp/zonnepanelen-btw','hulp/thuisbatterij-btw','hulp/lokale-regelingen']:
  p.set_content(render_static(route),wait_until='load');p.wait_for_timeout(70)
  for w in [1440,390,320]:
   p.set_viewport_size({'width':w,'height':1000});d=p.evaluate('({width:innerWidth,scroll:document.documentElement.scrollWidth})');report['screens'].append({'route':route,**d})
  if route=='advies':assert 'nog niet geactiveerd' in p.locator('#advice-app').inner_text()
 b.close()
(root/'qa/browser-extra.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2));assert not report['errors'];assert all(s['scroll']<=s['width'] for s in report['screens'])
