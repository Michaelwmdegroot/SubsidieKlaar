from pathlib import Path
from playwright.sync_api import sync_playwright
import json
root=Path(__file__).resolve().parents[2]
(root/'qa/browser').mkdir(parents=True,exist_ok=True)
html=(root/'qa/SubsidieReady-mijn-plan-test.html').read_text()
report={'method':'Chromium in-memory standalone HTML; real HTTP backend tested separately. Browser navigation is blocked by environment policy.','screens':[],'errors':[],'requests':[]}
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1440,'height':1050},accept_downloads=True)
 page.on('pageerror',lambda e:report['errors'].append(str(e)))
 page.on('request',lambda r:report['requests'].append(r.url))
 page.on('dialog',lambda d:d.accept())
 page.set_content(html,wait_until='load')
 page.evaluate("""() => {if(!crypto.randomUUID)crypto.randomUUID=()=>[...crypto.getRandomValues(new Uint8Array(16))].map(x=>x.toString(16).padStart(2,'0')).join('');} """)
 page.wait_for_timeout(150)
 page.locator('[data-pa=sample]').first.click();page.wait_for_timeout(100)
 print('headings',page.locator('h1,h2').all_text_contents())
 page.screenshot(path=str(root/'qa/browser/plan-overview-1440.png'),full_page=True)
 for width in [1440,1024,768,390,360,320]:
  page.set_viewport_size({'width':width,'height':1050})
  for tab in ['overview','work','documents','timeline']:
   page.locator(f'[data-tab={tab}]').click();page.wait_for_timeout(60)
   dims=page.evaluate('({width:innerWidth,scroll:document.documentElement.scrollWidth})')
   report['screens'].append({'width':width,'tab':tab,**dims})
   if width in [1440,390] and tab in ['overview','work']:page.screenshot(path=str(root/f'qa/browser/plan-{tab}-{width}.png'),full_page=True)
 page.set_viewport_size({'width':1440,'height':1050})
 page.locator('[data-tab=work]').click()
 page.locator('[data-task=source]').check()
 assert page.locator('[data-task=source]').is_checked()
 page.locator('[name=area]').fill('55')
 page.locator('#measure-form button[type=submit]').click()
 assert not page.locator('[data-task=source]').is_checked()
 page.locator('[name=installed]').fill('2026-10-01');page.locator('[name=stage]').select_option('installed')
 page.locator('#measure-form button[type=submit]').click()
 with page.expect_download() as d:page.locator('[data-pa=export]').click()
 f=d.value;f.save_as(str(root/'qa/browser/plan.json'));x=json.loads((root/'qa/browser/plan.json').read_text());assert x['app']=='SubsidieReadyPlan';assert len(x['projects'][0]['measures'])==3
 page.locator('[data-tab=timeline]').click()
 with page.expect_download() as d:page.locator('[data-pa=calendar]').click()
 d.value.save_as(str(root/'qa/browser/deadlines.ics'));assert 'DTSTART' in (root/'qa/browser/deadlines.ics').read_text()
 page.locator('[data-pa=login]').click();assert 'niet aangesloten' in page.locator('#plan-dialog').inner_text();page.keyboard.press('Escape')
 # ZIP contains local plan, not a claimed cloud sync.
 with page.expect_download() as d:page.locator('[data-pa=zip]').click()
 d.value.save_as(str(root/'qa/browser/plan.zip'))
 # Import a legacy warmtepomp project.
 legacy={'app':'SubsidieKlaar','schemaVersion':1,'demo':True,'state':{'ownerType':'owner_occupier','brand':'Fictief','model':'TEST','installed':'yes','installationDate':'2026-05-01'}}
 page.locator('#plan-import').set_input_files({'name':'legacy.json','mimeType':'application/json','buffer':json.dumps(legacy).encode()})
 page.wait_for_timeout(100);assert 'Geïmporteerd warmtepompplan' in page.locator('.p-content').inner_text()
 # New plan then isolated local files and deletion.
 page.locator('[data-pa=new]').first.click();page.locator('#new-form [name=title]').fill('Testplan')
 page.locator('#new-form [value=zonnepanelen]').check();page.locator('#new-form button[type=submit]').click()
 page.locator('[data-tab=documents]').click()
 filebytes=b'%PDF-1.7\nFICTIEF testbestand niet voor werkelijk gebruik\n%%EOF'
 page.locator('#files-form [name=files]').set_input_files({'name':'FICTIEF.pdf','mimeType':'application/pdf','buffer':filebytes})
 page.locator('#files-form button[type=submit]').click();page.wait_for_timeout(80)
 assert 'FICTIEF.pdf' in page.locator('.p-file-list').inner_text()
 with page.expect_download() as d:page.locator('[data-pa=file-get]').click()
 d.value.save_as(str(root/'qa/browser/FICTIEF.pdf'));assert (root/'qa/browser/FICTIEF.pdf').read_bytes()==filebytes
 page.locator('[data-pa=file-remove]').click();assert 'FICTIEF.pdf' not in page.locator('.p-file-list').inner_text()
 # Sales demonstrator is explicitly fictional, no request calls.
 salehtml=(root/'qa/SubsidieReady-sales-test.html').read_text();page.set_content(salehtml,wait_until='load');page.wait_for_timeout(100)
 page.locator('#sales-demo').click()
 page.wait_for_timeout(150);print('SALES:',page.locator('#sales-app').inner_text()[:700]);print('ERRORS:',report['errors']);assert 'fictieve demonstratie' in page.locator('#sales-app').inner_text().lower()
 page.screenshot(path=str(root/'qa/browser/sales-1440.png'),full_page=True)
 for w in [1440,1024,768,390,360,320]:
  page.set_viewport_size({'width':w,'height':1050});dims=page.evaluate('({width:innerWidth,scroll:document.documentElement.scrollWidth})');report['screens'].append({'width':w,'tab':'sales',**dims})
 report['assertions']=['manual task invalidation','local JSON export','calendar export','offline account gate','ZIP download','legacy project import','local attachment byte integrity','local file deletion','fictional sales inbox']
 b.close()
print(json.dumps(report,indent=2))
(root/'qa/browser-report.json').write_text(json.dumps(report,indent=2))
assert not report['errors'],report['errors']
assert all(s['scroll']<=s['width'] for s in report['screens']),[s for s in report['screens'] if s['scroll']>s['width']]
assert not report['requests'],report['requests']
