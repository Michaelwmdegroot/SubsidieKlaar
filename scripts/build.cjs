// Build a portable, self-contained HTML concept. No network or package install.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
let html=fs.readFileSync(path.join(root,'index.html'),'utf8');
let css=fs.readFileSync(path.join(root,'assets/style.css'),'utf8');
const font=fs.readFileSync(path.join(root,'vendor/NotoSans-Regular.ttf')).toString('base64');
const logo=fs.readFileSync(path.join(root,'assets/mark.svg')).toString('base64');
css=css.replace("url('../vendor/NotoSans-Regular.ttf')",`url('data:font/ttf;base64,${font}')`);
html=html.replace('<link rel="stylesheet" href="assets/style.css">',()=>'<style>'+css+'</style>');
const scripts=[];
html=html.replace(/<script defer src="([^"]+)"><\/script>/g,(_,file)=>{scripts.push('<script>'+fs.readFileSync(path.join(root,file),'utf8').replace(/<\/script/gi,'<\\/script').replaceAll('assets/mark.svg','data:image/svg+xml;base64,'+logo)+'</script>');return '';});
html=html.replace(/^[\t ]+$/gm,'');
html=html.replaceAll('href="assets/mark.svg"','href="data:image/svg+xml;base64,'+logo+'"');
// Inline scripts run after the DOM exists, as their original defer attributes intended.
const notices=['NOTICE.md','pdf-lib.LICENSE.md','jszip.LICENSE.md','fontkit.LICENSE.txt','NotoSans.LICENSE.txt'].map(name=>name+'\n'+fs.readFileSync(path.join(root,'vendor',name),'utf8')).join('\n\n');
html=html.replace('</html>',()=>'<!-- Third-party license notices\n'+notices.replaceAll('-->','--&gt;')+'\n-->\n</html>');
// A replacement callback preserves literal $ sequences inside embedded JavaScript.
// Insert code last: its HTML export templates contain their own closing tags.
html=html.replace('</body>',()=>scripts.join('\n')+'\n</body>');
fs.mkdirSync(path.join(root,'concept'),{recursive:true});
fs.writeFileSync(path.join(root,'concept/SubsidieKlaar-concept.html'),html);
console.log('Portable concept built: concept/SubsidieKlaar-concept.html ('+Math.round(Buffer.byteLength(html)/1024)+' KB)');
