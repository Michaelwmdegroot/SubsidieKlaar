'use strict';
// Read-only acceptance probe. No login, cookies, event POSTs, documents or DNS changes.
const fs = require('node:fs');
const path = require('node:path');
const ORIGIN = 'https://subsidieready.nl';
const LIMIT = 6 * 1024 * 1024;

async function bodyText(response) {
  if (!response.body) return '';
  const reader = response.body.getReader(), chunks = [];
  let size = 0;
  try {
    for (;;) {
      const {done, value} = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > LIMIT) { await reader.cancel(); throw Error('response-too-large'); }
      chunks.push(Buffer.from(value));
    }
  } finally { reader.releaseLock(); }
  return Buffer.concat(chunks).toString('utf8');
}

async function checkLive({fetchImpl = globalThis.fetch, expected} = {}) {
  if (!expected || expected.product !== 'SubsidieReady' || !expected.build || !expected.version) {
    throw Error('Expected release metadata is required.');
  }
  const report = {origin: ORIGIN, checkedAt: new Date().toISOString(),
    expected: {version: expected.version, build: expected.build},
    scope: 'Read-only HTTP checks, not browser/hosting/privacy release approval.',
    checks: [], warnings: [], ok: false};
  const check = (name, pass, detail = '') => report.checks.push({name, pass: !!pass, detail});
  async function request(url) {
    try {
      const response = await fetchImpl(url, {method: 'GET', redirect: 'manual',
        credentials: 'omit', cache: 'no-store', signal: AbortSignal.timeout(10000),
        headers: {'User-Agent': 'SubsidieReady-readonly-acceptance/1.0'}});
      const text = await bodyText(response);
      return {status: response.status, headers: response.headers, text};
    } catch (e) {
      // Do not copy arbitrary error messages, response bodies or secrets into reports.
      const code = e?.cause?.code;
      const detail = ['ENOTFOUND','ECONNREFUSED','ETIMEDOUT','CERT_HAS_EXPIRED','UNABLE_TO_VERIFY_LEAF_SIGNATURE'].includes(code)
        ? code : e?.name === 'TimeoutError' ? 'timeout' : 'network-or-response-error';
      check('bereikbaar: ' + url, false, detail);
      return null;
    }
  }
  const status200 = r => r?.status === 200;
  const isJSON = r => /application\/json/i.test(r?.headers.get('content-type') || '');
  const parse = r => { try { return isJSON(r) ? JSON.parse(r.text) : null; } catch { return null; } };
  const noindex = r => /noindex/i.test(r?.headers.get('x-robots-tag') || '');
  const home = await request(ORIGIN + '/');
  if (!home) return report;
  const isHome = status200(home) && /<title>[^<]*SubsidieReady/i.test(home.text) && /<h1\b/i.test(home.text);
  check('HTTPS-homepage is SubsidieReady', isHome, 'HTTP ' + home.status);
  // Stop on parking/login/error pages instead of scanning unrelated infrastructure.
  if (!isHome) return report;
  check('Homepage mag worden geindexeerd', !noindex(home) && !/<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(home.text));
  check('Canonical verwijst naar het eigen domein', home.text.includes('rel="canonical" href="' + ORIGIN + '/"'));
  const csp = home.headers.get('content-security-policy') || '';
  check('Veiligheidsheaders actief', home.headers.get('x-content-type-options') === 'nosniff' &&
    /default-src\s+'self'/.test(csp) && /object-src\s+'none'/.test(csp) && /frame-ancestors\s+'none'/.test(csp) &&
    home.headers.get('referrer-policy') === 'no-referrer' && /max-age=[1-9]\d*/.test(home.headers.get('strict-transport-security') || ''));
  const version = await request(ORIGIN + '/version.json'), release = parse(version);
  check('Exacte release-build staat online', status200(version) && release?.product === expected.product &&
    release?.version === expected.version && release?.build === expected.build && release?.documents === 'browser-only');
  const health = await request(ORIGIN + '/api/health.php'), h = parse(health);
  check('PHP voert de healthroute uit', status200(health) && h?.service === expected.product &&
    h?.version === expected.version && h?.status === 'ok' && h?.document_processing === 'browser-only' && noindex(health));
  const settings = await request(ORIGIN + '/api/settings.php'), s = parse(settings);
  const settingsOK = status200(settings) && s?.service === expected.product && typeof s.analytics === 'boolean' &&
    Object.keys(s).every(k => ['service','version','analytics','operator','contact'].includes(k)) && noindex(settings);
  check('Publieke instellingen bevatten alleen toegestane velden', settingsOK);
  if (settingsOK && s.analytics === false) report.warnings.push('Gebruikstellingen staan uit; dit blokkeert de documentenwerkbank niet.');
  const pages = ['/regelingen/','/subsidies/','/btw/','/financiering/','/hulp/','/hulp/factuur-warmtepomp/','/hulp/betaalbewijs/','/hulp/meldcode/','/hulp/zonnepanelen-btw/','/hulp/thuisbatterij-btw/','/privacy/','/voorwaarden/','/bronnen/','/over/'];
  for (const page of pages) {
    const r = await request(ORIGIN + page);
    check('Pagina ' + page, status200(r) && /SubsidieReady/.test(r.text) && /<h1\b/.test(r.text));
  }
  for (const [file, type] of [['assets/app.js', /(?:javascript|ecmascript)/i], ['assets/style.css', /text\/css/i]]) {
    const r = await request(ORIGIN + '/' + file);
    check('Asset ' + file, status200(r) && type.test(r.headers.get('content-type') || '') && r.text.length > 1000 && !/^\s*<!doctype/i.test(r.text));
  }
  // Review-only additions are public for owner assessment, never account-ready in production.
  const betaPages = ['/mijn-plan/','/advies/','/sales/','/bronbeheer/'];
  let planPage = null;
  for (const page of betaPages) {
    const r = await request(ORIGIN + page);
    if (page === '/mijn-plan/') planPage = r;
    const metaNoindex = /<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i.test(r?.text || '');
    check('Proefpagina bereikbaar en noindex: ' + page,
      status200(r) && /SubsidieReady/.test(r.text) && metaNoindex && noindex(r));
  }
  // Prove the deployed HTML/JS offers the account controls without invoking the UI,
  // creating a session on the account backend, or submitting test customer data.
  // Actual button rendering, email delivery and plan sync remain separate browser tests.
  const planApp = await request(ORIGIN + '/assets/plan-app.js');
  const cloudClient = await request(ORIGIN + '/assets/next-api.js');
  check('Accountinterface en aparte optionele marketingkeuze in live bestanden',
    status200(planPage) &&
    planPage.text.includes('src="/assets/next-api.js"') &&
    planPage.text.includes('src="/assets/plan-app.js"') &&
    status200(planApp) &&
    planApp.text.includes('Inloggen & bewaren') &&
    planApp.text.includes('name="terms" required') &&
    planApp.text.includes('name="marketingEmail"') &&
    status200(cloudClient) &&
    cloudClient.text.includes('/api/next/?action=bootstrap') &&
    cloudClient.text.includes("credentials:'same-origin'"));
  const nextVersion = await request(ORIGIN + '/next-version.json');
  const expectedNext = JSON.parse(fs.readFileSync(path.join(__dirname, '../next-version.json'), 'utf8'));
  const onlineNext = parse(nextVersion);
  check('Exacte proefversie en cloud blijft uit', status200(nextVersion) && onlineNext?.product === 'SubsidieReady' &&
    onlineNext?.build === expectedNext.build && onlineNext?.mode === 'review-only' && onlineNext?.cloudDefault === 'disabled');
  const betaApi = await request(ORIGIN + '/api/next/?action=bootstrap');
  const betaSettings = parse(betaApi);
  const accountUnavailable = betaApi?.status === 503 && betaSettings?.configured === false &&
    !betaApi?.headers.get('set-cookie');
  const accountConfigured = betaApi?.status === 200 && betaSettings?.mode === 'production' &&
    betaSettings?.accounts === true && betaSettings?.vault === false && betaSettings?.leads === false &&
    betaSettings?.controller === 'NIVO Groep Holland B.V.' && betaSettings?.contact === 'info@nivogroepholland.nl' &&
    betaSettings?.user === null && typeof betaSettings?.csrf === 'string' && betaSettings.csrf.length === 64 &&
    /^__Host-SRNext=/.test(betaApi.headers.get('set-cookie')||'') &&
    /;\s*Secure(?:;|$)/i.test(betaApi.headers.get('set-cookie')||'') &&
    /;\s*HttpOnly(?:;|$)/i.test(betaApi.headers.get('set-cookie')||'') &&
    /;\s*SameSite=Strict(?:;|$)/i.test(betaApi.headers.get('set-cookie')||'');
  check('Accountservice veilig gesloten of expliciet NIVO-account-only', (accountUnavailable||accountConfigured) &&
    noindex(betaApi) && /no-store/.test(betaApi?.headers.get('cache-control') || ''));
  report.accountBootstrap = accountConfigured ? 'enabled' : accountUnavailable ? 'disabled' : 'unknown';
  // Safe production diagnostics: only booleans and HTTP status; never save
  // response JSON, Set-Cookie, CSRF token, code, emails, or a user identifier.
  const accountCookie = betaApi?.headers.get('set-cookie') || '';
  const accountContract = {
    productionMode: betaSettings?.mode === 'production',
    accountsEnabled: betaSettings?.accounts === true,
    vaultDisabled: betaSettings?.vault === false,
    leadsDisabled: betaSettings?.leads === false,
    controllerMatches: betaSettings?.controller === 'NIVO Groep Holland B.V.',
    contactMatches: betaSettings?.contact === 'info@nivogroepholland.nl',
    anonymousUser: betaSettings?.user === null,
    csrfShapeValid: typeof betaSettings?.csrf === 'string' && betaSettings.csrf.length === 64,
    hostCookie: /^__Host-SRNext=/.test(accountCookie),
    secureCookie: /;\s*Secure(?:;|$)/i.test(accountCookie),
    httpOnlyCookie: /;\s*HttpOnly(?:;|$)/i.test(accountCookie),
    strictCookie: /;\s*SameSite=Strict(?:;|$)/i.test(accountCookie),
    noindex: noindex(betaApi),
    noStore: /no-store/.test(betaApi?.headers.get('cache-control') || '')
  };
  report.accountDiagnostics = {
    httpStatus: Number.isInteger(betaApi?.status) ? betaApi.status : null,
    validJson: !!betaSettings,
    failedContractChecks: Object.entries(accountContract).filter(([,ok])=>!ok).map(([key])=>key)
  };
  if(accountConfigured) report.warnings.push('Publieke NIVO-accountdienst actief; sales en kluis blijven uit. Individuele account-, mailbox- en DB-privacy blijven afzonderlijk te beoordelen.');
  const robots = await request(ORIGIN + '/robots.txt');
  check('Robots beschermt beheer, niet de hele site', status200(robots) && /Disallow:\s*\/admin\//.test(robots.text) &&
    !/^Disallow:\s*\/\s*$/m.test(robots.text) && robots.text.includes(ORIGIN + '/sitemap.xml'));
  const sitemap = await request(ORIGIN + '/sitemap.xml');
  check('Sitemap bevat alleen publieke pagina’s', status200(sitemap) && [ORIGIN + '/', ...pages.map(p => ORIGIN + p)]
    .every(u => sitemap.text.includes('<loc>' + u + '</loc>')) && !/\/(?:admin|api|dossier|mijn-plan|advies|sales|bronbeheer)(?:\/|<)/.test(sitemap.text) &&
    !/hulp\/(?:isolatie-checklist|lokale-regelingen)\//.test(sitemap.text));
  for (const file of ['/.git/config','/.env','/server/bootstrap.php','/server/next/service.php','/scripts/setup-admin.php','/scripts/next/setup.php','/tests/core.test.cjs','/templates/index.html']) {
    const r = await request(ORIGIN + file);
    check('Interne route afgeschermd: ' + file, r && [403,404].includes(r.status));
  }
  const missing = await request(ORIGIN + '/sr-acceptance-does-not-exist');
  check('Onbekende pagina geeft echte HTTP 404', missing?.status === 404);
  for (const route of ['/admin/','/admin/?export=1']) {
    const r = await request(ORIGIN + route);
    const inactive = r?.status === 503 && /Beheer is nog niet geactiveerd/.test(r.text) && settingsOK && s.analytics === false;
    const login = r?.status === 200 && /name="password"/.test(r.text) && /name="csrf"/.test(r.text) && !/Dossiers gestart/.test(r.text);
    const cookie = r?.headers.get('set-cookie') || '';
    const secureCookie = !cookie || (/__Host-SRAdmin=/.test(cookie) && /;\s*Secure/i.test(cookie) && /;\s*HttpOnly/i.test(cookie) && /SameSite=Strict/i.test(cookie));
    check('Beheer blijft afgesloten: ' + route, (inactive || login) && noindex(r) && /no-store/.test(r?.headers.get('cache-control') || '') && secureCookie);
    if (route === '/admin/' && inactive) report.warnings.push('Beheer is nog niet geactiveerd. Er is geen standaardwachtwoord.');
  }
  for (const url of ['http://subsidieready.nl/', 'https://www.subsidieready.nl/']) {
    const r = await request(url);
    check('Canonical redirect: ' + url, r && [301,308].includes(r.status) && r.headers.get('location') === ORIGIN + '/');
  }
  report.ok = report.checks.every(c => c.pass);
  return report;
}

module.exports = {checkLive, bodyText};
if (require.main === module) {
  const expected = JSON.parse(fs.readFileSync(path.join(__dirname, '../version.json'), 'utf8'));
  checkLive({expected}).then(report => {
    const output = path.join(__dirname, '../qa/live-check.json');
    fs.mkdirSync(path.dirname(output), {recursive: true});
    fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n');
    for (const c of report.checks) console.log((c.pass ? 'PASS ' : 'FAIL ') + c.name + (c.detail ? ' — ' + c.detail : ''));
    if (report.accountDiagnostics) console.log('ACCOUNT_BOOTSTRAP_DIAGNOSTIC ' + JSON.stringify(report.accountDiagnostics));
    for (const warning of report.warnings) console.log('NOTE ' + warning);
    console.log(report.ok ? 'HTTP smoke checks passed. Browser and hosting acceptance still required.' : 'NO-GO: live HTTP acceptance not confirmed.');
    process.exitCode = report.ok ? 0 : 1;
  }).catch(() => { console.error('Could not run live acceptance check.'); process.exitCode = 1; });
}
