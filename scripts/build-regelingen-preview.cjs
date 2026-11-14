'use strict';
const fs=require('node:fs'),path=require('node:path');
function build(){const root=path.resolve(__dirname,'..');const template=fs.readFileSync(path.join(root,'templates/regelingen-preview.html'),'utf8');const engine=fs.readFileSync(path.join(root,'scripts/regelingen-engine.cjs'),'utf8');if(template.split('/*__ENGINE__*/').length!==2)throw Error('Expected one engine marker');return template.replace('/*__ENGINE__*/',()=>engine.replace(/<\/script/gi,'<\\/script'));}
module.exports={build};
if(require.main===module){const dest=path.resolve(process.argv[2]||path.join(__dirname,'../qa/SubsidieReady-Regelingencheck-preview.html'));fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,build());console.log(dest);}
