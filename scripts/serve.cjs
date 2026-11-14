'use strict';
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),i=process.argv.indexOf('--port');
const port=Number((i>=0?process.argv[i+1]:'')||process.env.PORT||5173);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.ttf':'font/ttf','.xml':'application/xml','.txt':'text/plain; charset=utf-8'};
const csp=fs.readFileSync(path.join(root,'.htaccess'),'utf8').match(/Content-Security-Policy "([^"]+)"/)?.[1].replace('; upgrade-insecure-requests','');
http.createServer((req,res)=>{
 const headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','X-Robots-Tag':'noindex, nofollow','Content-Security-Policy':csp||"default-src 'self'"};
 let p;try{p=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400,headers).end();return;}
 if(p==='/api/settings.php'){res.writeHead(200,{...headers,'Content-Type':'application/json'}).end('{"service":"SubsidieReady","analytics":false}');return;}
 if(p.startsWith('/api/')||p.startsWith('/admin/')){res.writeHead(503,{...headers,'Content-Type':'text/plain; charset=utf-8'}).end('PHP-beheer is alleen beschikbaar op PHP-hosting.');return;}
 if(p.split('/').some(x=>x.startsWith('.'))||/^\/(?:server|scripts|tests|templates|docs|concept)(?:\/|$)/.test(p)||/\.(?:php|cjs|md|yml)$/.test(p)){res.writeHead(404,headers).end();return;}
 if(p.endsWith('/'))p+='index.html';
 const file=path.resolve(root,'.'+p);
 if(!file.startsWith(root+path.sep)){res.writeHead(404,headers).end();return;}
 fs.stat(file,(err,stat)=>{
  if(err||!stat.isFile()){res.writeHead(404,{...headers,'Content-Type':'text/html; charset=utf-8'});fs.createReadStream(path.join(root,'404.html')).pipe(res);return;}
  res.writeHead(200,{...headers,'Content-Type':types[path.extname(file)]||'application/octet-stream'});fs.createReadStream(file).pipe(res);
 });
}).listen(port,'127.0.0.1',()=>console.log('SubsidieReady preview on http://127.0.0.1:'+port));
