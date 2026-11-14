'use strict';

// Runs ONLY in the isolated MySQL GitHub Actions job, never in default npm test.
// All email addresses, credentials and records are synthetic and ephemeral.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const net = require('node:net');
const {spawn, execFileSync} = require('node:child_process');
const root = path.resolve(__dirname, '..');
const Plan = require('../assets/plan-core.js');

if (process.env.SR_MYSQL_TEST !== '1') {
  throw new Error('MySQL integration is allowed only when SR_MYSQL_TEST=1.');
}
const freePort = () => new Promise(resolve => {
  const server = net.createServer();
  server.listen(0, '127.0.0.1', () => {
    const port = server.address().port;
    server.close(() => resolve(port));
  });
});
const php = (code, env) => execFileSync('php', ['-r', code], {
  cwd: root, env, encoding: 'utf8', maxBuffer: 12 * 1024 * 1024
});
const waitFor = async url => {
  for (let attempt = 0; attempt < 100; attempt++) {
    try { const response = await fetch(url); if (response.status) return; } catch {}
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  throw Error('Synthetic PHP API server did not start');
};
test('MySQL adapter: real PHP auth, persistent encrypted plans, ownership and account removal', async t => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'sr-mysql-test-'));
  const privateDir = path.join(temp, 'private');
  const port = await freePort();
  const base = 'http://127.0.0.1:' + port;
  const env = {...process.env};
  const init =
    '$pdo=new PDO("mysql:host=".getenv("SR_MYSQL_HOST").";port=".getenv("SR_MYSQL_PORT").";dbname=".getenv("SR_MYSQL_DATABASE").";charset=utf8mb4",getenv("SR_MYSQL_USER"),getenv("SR_MYSQL_PASSWORD"),[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]);' +
    '$sql=file_get_contents("server/next/schema.sql");foreach(explode(";",$sql) as $statement)if(trim($statement)!=="")$pdo->exec($statement);';
  php(init, env);
  execFileSync('php', ['scripts/next/setup.php', '--local', '--dir=' + privateDir, '--origin=' + base], {
    cwd: root, env, stdio: 'pipe'
  });
  const config = path.join(privateDir, 'config.php');
  env.SR_NEXT_CONFIG = config;
  const prefix = 'require ' + JSON.stringify(path.join(root, 'server/next/service.php')) + '; $c=srn_config();';
  const updateConfig = prefix +
    'unset($c["keyBytes"]);' +
    '$c["storage_driver"]="mysql";' +
    '$c["mysql"]=[' +
      '"host"=>getenv("SR_MYSQL_HOST"),' +
      '"port"=>(int)getenv("SR_MYSQL_PORT"),' +
      '"database"=>getenv("SR_MYSQL_DATABASE"),' +
      '"user"=>getenv("SR_MYSQL_USER"),' +
      '"password"=>getenv("SR_MYSQL_PASSWORD")];' +
    '$c["vault_enabled"]=false;$c["leads_enabled"]=false;$c["staff_enabled"]=false;' +
    'file_put_contents(' + JSON.stringify(config) + ', "<?php return ".var_export($c,true).";");';
  php(updateConfig, env);
  const readState = () => JSON.parse(php(prefix + 'echo json_encode(srn_tx($c,fn(&$s)=>$s));', env));
  const codeFor = (email, challenge) => {
    const message = Object.values(readState().outbox).find(m => m.to === email && m.key === 'otp:' + challenge);
    assert.ok(message, 'OTP must be in encrypted private MySQL state');
    return message.text.match(/[0-9]{8}/)[0];
  };
  let child;
  const start = async () => {
    child = spawn('php', ['-S', '127.0.0.1:' + port, '-t', root, path.join(root, 'scripts/next/router.php')], {
      cwd: root, env, stdio: 'ignore'
    });
    await waitFor(base + '/api/next/?action=bootstrap');
  };
  const stop = async () => {
    if (!child) return;
    const active = child;
    child = null;
    active.kill();
    await new Promise(resolve => { if (active.exitCode !== null) resolve(); else active.once('exit', resolve); });
  };
  class Client {
    constructor() { this.cookie = ''; this.csrf = ''; this.user = null; }
    async boot() {
      const r = await fetch(base + '/api/next/?action=bootstrap', {headers: {Cookie: this.cookie}});
      const d = await r.json();
      if (r.headers.get('set-cookie')) this.cookie = r.headers.get('set-cookie').split(';')[0];
      this.csrf = d.csrf; this.user = d.user;
      return {r, d};
    }
    async post(action, data = {}) {
      const r = await fetch(base + '/api/next/?action=' + action, {
        method: 'POST',
        headers: {Cookie: this.cookie, Origin: base, 'X-CSRF-Token': this.csrf, 'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      });
      const d = await r.json();
      if (r.headers.get('set-cookie')) this.cookie = r.headers.get('set-cookie').split(';')[0];
      if (d.csrf) this.csrf = d.csrf;
      if ('user' in d) this.user = d.user;
      return {r, d};
    }
    async login(email) {
      const bootstrap = await this.boot();
      assert.equal(bootstrap.r.status, 200);
      const first = await this.post('auth-start', {email, serviceAccepted: true, termsAccepted: true, termsVersion: '2026-11-14-account-v1', marketingEmailOptIn: false});
      assert.equal(first.r.status, 200);
      const response = await this.post('auth-verify', {
        challenge: first.d.challenge,
        code: codeFor(email, first.d.challenge)
      });
      assert.equal(response.r.status, 200, JSON.stringify(response.d));
      return response;
    }
  }
  try {
    const check = JSON.parse(execFileSync('php', ['scripts/next/mysql-check.php', '--check'], {
      cwd: root, env, encoding: 'utf8'
    }));
    assert.equal(check.status, 'database_ready');
    assert.equal(check.production_enabled, false);
    await start();
    await t.test('staging pilot presents accounts but no vault or sales', async () => {
      const guest = new Client();
      const {r, d} = await guest.boot();
      assert.equal(r.status, 200);
      assert.equal(d.accounts, true);
      assert.equal(d.vault, false);
      assert.equal(d.leads, false);
      assert.equal(d.user, null);
    });
    const alice = new Client();
    await t.test('single use OTP creates one account and stores only encrypted SQL state', async () => {
      await alice.login('alice@example.invalid');
      assert.equal(alice.user.email, 'alice@example.invalid');
      assert.equal(Object.keys(readState().accounts).length, 1);
      assert.equal(fs.existsSync(path.join(privateDir, 'state.bin')), false);
      const q = php(
        '$p=new PDO("mysql:host=".getenv("SR_MYSQL_HOST").";port=".getenv("SR_MYSQL_PORT").";dbname=".getenv("SR_MYSQL_DATABASE"),getenv("SR_MYSQL_USER"),getenv("SR_MYSQL_PASSWORD"));' +
        '$r=$p->query("SELECT encrypted_state FROM sr_next_state WHERE id=1")->fetchColumn();echo base64_encode($r);',
        env
      );
      const ciphertext = Buffer.from(q, 'base64');
      assert.equal(ciphertext.subarray(0, 4).toString(), 'SRN1');
      assert.equal(ciphertext.includes(Buffer.from('alice@example.invalid')), false);
    });
    const plan = Plan.newProject('Fictief SQL-testplan', ['isolatie']);
    const id = plan.id;
    await t.test('plan is stored with optimistic revision checks and no stray personal fields', async () => {
      plan.extraPrivateField = 'SECRET-MUST-NOT-BE-SAVED';
      const saved = await alice.post('project-save', {
        data: {app: 'SubsidieReadyPlan', schemaVersion: 3, projects: [plan]}, revision: 0
      });
      assert.equal(saved.r.status, 200, JSON.stringify(saved.d));
      assert.equal(saved.d.revision, 1);
      assert.equal((await alice.post('project-save', {
        data: {app: 'SubsidieReadyPlan', schemaVersion: 3, projects: [plan]}, revision: 0
      })).r.status, 409);
      assert.equal(JSON.stringify(readState()).includes('SECRET-MUST-NOT-BE-SAVED'), false);
    });
    await t.test('explicit email marketing consent can be withdrawn after verified login',async()=>{
      assert.equal(alice.user.marketingEmail,false);
      const accepted=await alice.post('marketing-email-set',{enabled:true,version:'2026-11-14-nivo-email-v1'});
      assert.equal(accepted.r.status,200);assert.equal(accepted.d.user.marketingEmail,true);
      assert.equal(readState().accounts[alice.user.id].marketingHistory.at(-1).enabled,true);
      const withdrawn=await alice.post('marketing-email-set',{enabled:false,version:'2026-11-14-nivo-email-v1'});
      assert.equal(withdrawn.r.status,200);assert.equal(withdrawn.d.user.marketingEmail,false);
      assert.equal(readState().accounts[alice.user.id].marketingHistory.at(-1).enabled,false);
    });
    await t.test('second account cannot access first account data', async () => {
      const bob = new Client();
      await bob.login('bob@example.invalid');
      assert.equal((await bob.post('project-get', {id})).r.status, 404);
      assert.equal((await bob.post('project-delete', {id, confirm: 'VERWIJDER'})).r.status, 404);
      assert.equal((await bob.post('projects-list')).d.projects.length, 0);
    });
    await t.test('PHP process restart preserves login session and plan', async () => {
      await stop(); await start();
      const r = await alice.post('project-get', {id});
      assert.equal(r.r.status, 200, JSON.stringify(r.d));
      assert.equal(r.d.revision, 1);
      assert.equal(r.d.data.projects[0].title, 'Fictief SQL-testplan');
    });
    await t.test('export and deletion are scoped to authenticated account', async () => {
      const exportResult = await alice.post('account-export');
      assert.equal(exportResult.r.status, 200);
      assert.equal(exportResult.d.projects.length, 1);
      const deleted = await alice.post('account-delete', {confirm: 'VERWIJDER'});
      assert.equal(deleted.r.status, 200);
      assert.equal(Object.values(readState().accounts).some(x => x.email === 'alice@example.invalid'), false);
      assert.equal(readState().projects[id], undefined);
      assert.equal((await alice.post('projects-list')).r.status, 403);
    });
    await t.test('NIVO production account-only config can load but rejects premature sales and vault',async()=>{
      const original=fs.readFileSync(config);
      const modify=phpPrefix=>php(phpPrefix+'unset($c["keyBytes"]);$c["mode"]="production";$c["origin"]="https://subsidieready.nl";$c["controller"]="NIVO Groep Holland B.V.";$c["contact"]="info@nivogroepholland.nl";$c["transport"]="mail";$c["mail_ready"]=true;$c["privacy_reviewed"]=true;$c["legal_reviewed"]=true;file_put_contents('+JSON.stringify(config)+',"<?php return ".var_export($c,true).";");',env);
      try{
        modify(prefix);
        assert.equal(php('require '+JSON.stringify(path.join(root,'server/next/service.php'))+';$c=srn_config();echo $c["mode"];',env),'production');
        php('require '+JSON.stringify(path.join(root,'server/next/service.php'))+';$c=srn_config();unset($c["keyBytes"]);$c["leads_enabled"]=true;file_put_contents('+JSON.stringify(config)+',"<?php return ".var_export($c,true).";");',env);
        assert.equal(php('require '+JSON.stringify(path.join(root,'server/next/service.php'))+'try{srn_config();echo "unsafe";}catch(Throwable $e){echo "blocked";}',env),'blocked');
      }finally{fs.writeFileSync(config,original);}
    });
    await t.test('production origin remains blocked even with a working SQL connection', async () => {
      const original = fs.readFileSync(config);
      try {
        php(prefix + 'unset($c["keyBytes"]);$c["mode"]="staging";$c["origin"]="https://subsidieready.nl";$c["transport"]="mail";$c["privacy_reviewed"]=true;' +
          'file_put_contents(' + JSON.stringify(config) + ', "<?php return ".var_export($c,true).";");', env);
        const r = await fetch(base + '/api/next/?action=bootstrap');
        assert.equal(r.status, 503);
      } finally {
        fs.writeFileSync(config, original);
      }
    });
  } finally {
    await stop();
    fs.rmSync(temp, {recursive: true, force: true});
  }
});
