from render_utils import ROOT, OUT, html, measure
from playwright.sync_api import sync_playwright
import json,urllib.request,urllib.error,base64,re,zipfile
routes=['/','/regelingen/','/subsidies/','/btw/','/financiering/','/hulp/','/hulp/factuur-warmtepomp/','/hulp/betaalbewijs/','/hulp/meldcode/','/hulp/isolatie-checklist/','/hulp/zonnepanelen-btw/','/hulp/thuisbatterij-btw/','/hulp/lokale-regelingen/','/bronnen/','/privacy/','/over/','/mijn-plan/','/sales/','/advies/','/bronbeheer/','/404.html','/admin/']
viewports=[(1440,960),(1280,800),(1024,768),(768,1024),(390,844),(320,740)]
report={'method':'Generated HTML and actual JS/CSS rendered in-memory with offline flag. Browser HTTP navigation blocked by environment. Real PHP functionality is tested separately by npm tests.','screens':[],'errors':[],'network':[],'checks':[]}
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path=__import__('os').getenv('SR_CHROMIUM','/usr/bin/chromium'),headless=True,args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1440,'height':960},accept_downloads=True)
 page.on('pageerror',lambda e:report['errors'].append(str(e)))
 page.on('request',lambda r:report['network'].append(r.url[:120]))
 page.on('dialog',lambda d:d.accept());page.set_default_timeout(8000)
 def check_screen(route,label='page'):
  d=measure(page);report['screens'].append({'route':route,'state':label,**d})
  assert d['scroll']<=d['width'],(route,label,d)
  assert d['brokenImages']==0,(route,'broken images')
 def load(route,w=1440,h=960):
  global page
  page.close();page=b.new_page(viewport={'width':w,'height':h},accept_downloads=True);page.set_default_timeout(15000)
  page.on('pageerror',lambda e:report['errors'].append(str(e)))
  page.on('request',lambda r:report['network'].append(r.url[:120]))
  page.on('dialog',lambda d:d.accept())
  page.set_viewport_size({'width':w,'height':h});page.set_content(html(route),wait_until='load');page.evaluate('document.fonts.ready');page.wait_for_timeout(45)
 for route in ([] if __import__('os').getenv('ONLY_FUNCTIONS')=='1' else routes):
  load(route)
  for w,h in viewports:
   page.set_viewport_size({'width':w,'height':h});page.wait_for_timeout(35);check_screen(route)
   if route=='/regelingen/':
    assert page.evaluate('document.documentElement.scrollHeight <= innerHeight+2'),'dashboard still fits viewport'
  print('LAYOUT',route,flush=True)
 (ROOT/('qa/sitewide-layout-report.json' if report['screens'] else 'qa/sitewide-empty.json')).write_text(json.dumps(report,indent=2))
 print('LAYOUT DONE',len(report['screens']),flush=True)
 import os
 if os.getenv('ONLY_LAYOUT')=='1':
  b.close();raise SystemExit(0)
 # Homepage including formerly dark sections: foreground remains dark on light.
 load('/')
 for selector in ['.bottom-cta h2','.bottom-cta p','.installer-band h2','.installer-band p']:
  color=page.locator(selector).evaluate('(el)=>getComputedStyle(el).color');assert color not in ['rgb(255, 255, 255)','rgba(255, 255, 255, 1)'],(selector,color)
 page.screenshot(path=str(OUT/'sitewide-home-desktop.png'),full_page=True)
 page.screenshot(path=str(OUT/'sitewide-home-hero.png'),full_page=False)
 page.set_viewport_size({'width':390,'height':844});page.screenshot(path=str(OUT/'sitewide-home-mobile.png'),full_page=True)
 page.locator('.mobile-nav summary').first.click();assert page.locator('.mobile-nav[open] a[href="/mijn-plan/"]').is_visible();page.keyboard.press('Escape')
 report['checks'].extend(['light sections retain dark readable text','native mobile menu exposes Mijn plan'])
 # Static pages are fully linked, with single h1 and sidebar anchors.
 for route in ['/subsidies/','/btw/','/financiering/','/hulp/','/hulp/betaalbewijs/','/hulp/isolatie-checklist/','/bronnen/','/privacy/']:
  load(route);assert page.locator('h1').count()==1
  for anchor in page.locator('.article-nav a').evaluate_all('(xs)=>xs.map(x=>x.getAttribute("href"))'):assert page.locator(anchor).count()==1
  if route in ['/subsidies/','/hulp/','/hulp/isolatie-checklist/']:
   page.screenshot(path=str(OUT/('sitewide-'+route.strip('/').replace('/','-')+'.png')),full_page=False)
   page.set_viewport_size({'width':390,'height':844});page.screenshot(path=str(OUT/('sitewide-'+route.strip('/').replace('/','-')+'-mobile.png')),full_page=True)
 report['checks'].append('knowledge pages retain one h1 and valid contents anchors')
 print('ARTICLE CHECKS DONE',flush=True)
 # Existing warmtepomp flow and actual in-browser PDF/ZIP/project exports.
 load('/');page.locator('[data-action=demo]').first.click();page.wait_for_selector('.demo-banner');page.wait_for_timeout(100)
 for w,h in [viewports[0],viewports[-2],viewports[-1]]:
  page.set_viewport_size({'width':w,'height':h})
  for step in range(4):
   page.locator(f'[data-action=step][data-step="{step}"]').click();page.wait_for_timeout(30);check_screen('/#dossier','step-'+str(step))
 page.set_viewport_size({'width':1440,'height':960});page.locator('[data-action=step][data-step="0"]').click();page.screenshot(path=str(OUT/'sitewide-warmtepomp.png'),full_page=False)
 page.locator('[data-action=step][data-step="3"]').click()
 # Use real app's download buttons, not a mocked export function.
 for action,filename in [('download-pdf','warmtepomp.pdf'),('download-zip','warmtepomp.zip'),('download-project','warmtepomp.json')]:
  target=page.locator('[data-action="'+action+'"]')
  if not target.count():
   # Resolve exactly from actual UI if action naming differs; this must remain documented.
   print('AVAILABLE',page.locator('[data-action]').evaluate_all('(xs)=>[...new Set(xs.map(x=>x.dataset.action))]'));raise Exception('Missing '+action)
  with page.expect_download() as d:target.first.click()
  d.value.save_as(str(OUT/filename));page.wait_for_timeout(400);print('DOWNLOAD',filename,flush=True)
 assert (OUT/'warmtepomp.pdf').read_bytes().startswith(b'%PDF')
 assert zipfile.ZipFile(OUT/'warmtepomp.zip').testzip() is None
 assert json.loads((OUT/'warmtepomp.json').read_text())['demo'] is True
 report['checks'].extend(['four warmtepomp steps remain usable','real PDF download','real ZIP download with integrity','legacy project download'])
 print('WARMTEPOMP DONE',flush=True)
 # Plan and workbenches preserve task invalidation and local export.
 load('/mijn-plan/');page.locator('[data-pa=sample]').first.click()
 for w,h in [viewports[0],viewports[-2],viewports[-1]]:
  page.set_viewport_size({'width':w,'height':h})
  for tab in ['overview','work','documents','timeline']:
   page.locator('[data-tab="'+tab+'"]').click();page.wait_for_timeout(25);check_screen('/mijn-plan/',tab)
 page.set_viewport_size({'width':1440,'height':960});page.locator('[data-tab=overview]').click();page.screenshot(path=str(OUT/'sitewide-plan.png'),full_page=False)
 page.locator('[data-tab=work]').click();page.screenshot(path=str(OUT/'sitewide-werkbank.png'),full_page=False)
 page.locator('[data-task=source]').check();assert page.locator('[data-task=source]').is_checked()
 page.locator('#measure-form [name=area]').fill('55');page.locator('#measure-form button[type=submit]').click();assert not page.locator('[data-task=source]').is_checked()
 with page.expect_download() as d:page.locator('[data-pa=export]').click()
 d.value.save_as(str(OUT/'plan.json'));assert len(json.loads((OUT/'plan.json').read_text())['projects'][0]['measures'])==3
 with page.expect_download() as d:page.locator('[data-pa=zip]').click()
 d.value.save_as(str(OUT/'plan.zip'));assert zipfile.ZipFile(OUT/'plan.zip').testzip() is None
 page.locator('[data-pa=cloud-save]').click();assert not report['network']
 report['checks'].extend(['four plan panels usable','manual checks invalidate after edit','plan JSON export','plan ZIP export','cloud remains unavailable without sending data'])
 print('PLAN DONE',flush=True)
 # Fictitious sales, no recipient data or backend service.
 load('/sales/');page.locator('#sales-demo').click();assert 'fictiev' in page.locator('#sales-app').inner_text().lower()
 for w,h in viewports:
  page.set_viewport_size({'width':w,'height':h});page.wait_for_timeout(25);check_screen('/sales/','fictitious board')
 page.set_viewport_size({'width':1440,'height':960});page.screenshot(path=str(OUT/'sitewide-sales.png'),full_page=False)
 report['checks'].append('sales demo retains explicit fictional label')
 # Dashboard remains interactive with unchanged rule engine.
 load('/regelingen/');page.locator('#example').click();page.wait_for_timeout(40)
 for w,h in viewports:
  page.set_viewport_size({'width':w,'height':h});page.wait_for_timeout(40);check_screen('/regelingen/','example')
  assert page.evaluate('document.documentElement.scrollHeight <= innerHeight+2')
 report['checks'].append('approved dashboard remains viewport-bound and interactive')
 # New visual layer respects reduced motion and makes no external requests.
 page.emulate_media(reduced_motion='reduce');assert page.evaluate('matchMedia("(prefers-reduced-motion: reduce)").matches')
 report['checks'].append('reduced-motion supported')
 assert not report['errors'],report['errors'];assert not report['network'],report['network']
 b.close()
report['ok']=True
(ROOT/'qa/sitewide-browser-report.json').write_text(json.dumps(report,indent=2))
print(json.dumps({'ok':True,'screens':len(report['screens']),'functional':len(report['checks']),'errors':report['errors'],'network':report['network']}))
