from pathlib import Path
import base64, re, json
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'qa/visual';OUT.mkdir(exist_ok=True)
IMAGES={str(p.relative_to(ROOT)): 'data:image/'+('svg+xml' if p.suffix=='.svg' else 'webp')+';base64,'+base64.b64encode(p.read_bytes()).decode() for p in (ROOT/'assets').rglob('*') if p.suffix in ['.webp','.svg']}
FONT=base64.b64encode((ROOT/'vendor/NotoSans-Regular.ttf').read_bytes()).decode()
def inline(text):
 for n,u in IMAGES.items():text=text.replace('/'+n,u).replace(n,u)
 return text.replace('../vendor/NotoSans-Regular.ttf','data:font/ttf;base64,'+FONT)
def html(route):
 file=ROOT/('index.html' if route=='/' else route.strip('/')+'/index.html')
 if route=='/404.html':file=ROOT/'404.html'
 if route=='/admin/':
  import subprocess
  h=subprocess.check_output(['php','-r','$_SERVER["HTTPS"]="on"; $_SERVER["SERVER_PORT"]="443"; $_SERVER["REQUEST_METHOD"]="GET"; require "admin/index.php";'],cwd=ROOT).decode()
 else:h=file.read_text()
 h=h.replace('<html lang="nl">','<html lang="nl" data-offline="true">')
 h=re.sub(r'<link rel="(?:icon|preload)"[^>]*>','',h)
 h=re.sub(r'<link rel="stylesheet" href="([^"]+)">',lambda m:'<style>'+inline((ROOT/m[1].lstrip('/')).read_text())+'</style>',h)
 scripts=[]
 def script(m):
  if m[1].endswith('metrics.js'):return ''
  scripts.append(inline((ROOT/m[1].lstrip('/')).read_text()).replace('</script','<\\/script'))
  return ''
 h=re.sub(r'<script defer src="([^"]+)"></script>',script,h)
 h=inline(h)
 shim="if(!crypto.randomUUID)crypto.randomUUID=()=>Array.from(crypto.getRandomValues(new Uint8Array(16)),x=>x.toString(16).padStart(2,'0')).join('');"
 h=h.replace('</body>','<script>'+shim+'</script>'+''.join('<script>'+x+'</script>' for x in scripts)+'</body>')
 return h

def measure(page):
 return page.evaluate('''() => ({width:innerWidth,scroll:document.documentElement.scrollWidth,height:innerHeight,bodyHeight:document.documentElement.scrollHeight,brokenImages:[...document.images].filter(i=>!i.complete||i.naturalWidth===0).length})''')
