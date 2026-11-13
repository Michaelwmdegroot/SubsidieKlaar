const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const portIndex = process.argv.indexOf('--port');
const port = Number((portIndex >= 0 ? process.argv[portIndex + 1] : '') || process.env.PORT || 5173);
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.woff2':'font/woff2','.ttf':'font/ttf','.md':'text/plain; charset=utf-8'};
http.createServer((req, res) => {
  let p; try { p = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); } catch {res.writeHead(400).end();return;}
  if (p === '/') p = '/index.html';
  const file = path.resolve(root, '.' + p);
  if (!file.startsWith(root + path.sep) || p.split('/').some(x => x.startsWith('.')) || /\/(?:tests|scripts)\//.test(p)) {res.writeHead(404).end();return;}
  fs.stat(file, (err, stat) => {
    if (err || !stat.isFile()) {res.writeHead(404).end('Niet gevonden');return;}
    res.writeHead(200, {'Content-Type':types[path.extname(file)] || 'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','X-Robots-Tag':'noindex, nofollow'});
    fs.createReadStream(file).pipe(res);
  });
}).listen(port, '0.0.0.0', () => console.log(`SubsidieKlaar concept listening on ${port}`));
