const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {execFileSync}=require('node:child_process');

test('portable HTML preserves executable modules and keeps license text outside scripts',()=>{
  const root=path.resolve(__dirname,'..');
  execFileSync(process.execPath,['scripts/build.cjs'],{cwd:root});
  const html=fs.readFileSync(path.join(root,'concept/SubsidieKlaar-concept.html'),'utf8');
  const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
  assert.equal(scripts.length,7);
  for(const [i,code] of scripts.entries())assert.doesNotThrow(()=>new vm.Script(code),`Embedded module ${i} must parse`);
  assert.ok(scripts.some(code=>code.includes('window.SKExport=Object.freeze')));
  assert.ok(scripts.every(code=>!code.includes('Third-party license notices')));
  assert.ok(html.lastIndexOf('Third-party license notices')>html.lastIndexOf('</script>'));
  assert.doesNotMatch(html,/<script[^>]+src=/);
  assert.doesNotMatch(html,/<link[^>]+href="assets\//);
});
