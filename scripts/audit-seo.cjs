'use strict';
// Bounded, read-only SEO inspection. No cookies, form submissions or off-site crawl.
const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.resolve(__dirname, '..');
const ORIGIN = 'https://subsidieready.nl';
const MAX_ROUTES = 60, MAX_BYTES = 2 * 1024 * 1024, CONCURRENCY = 4;
const REVIEW_ROUTES = ['/mijn-plan/', '/advies/', '/sales/', '/bronbeheer/'];
const HELP_ROUTES = ['/hulp/isolatie-checklist/', '/hulp/zonnepanelen-btw/', '/hulp/thuisbatterij-btw/', '/hulp/lokale-regelingen/'];
const DYNAMIC_ANCHORS = new Set(['/#dossier', '/#voorbeeld']);
const BLOCKED = /^\/(?:admin|api|server|docs|scripts|templates|tests|concept|qa|dist)(?:\/|$)/;

function decode(text = '') {
  return text.replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (_, entity) => {
    const named = {amp:'&', lt:'<', gt:'>', quot:'"', apos:"'", nbsp:' '};
    if (entity[0] !== '#') return named[entity.toLowerCase()];
    const n = entity[1].toLowerCase() === 'x' ? parseInt(entity.slice(2), 16) : Number(entity.slice(1));
    return n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : '\ufffd';
  });
}
function attrs(tag) {
  const result = {};
  for (const m of tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) result[m[1].toLowerCase()] = decode(m[2] ?? m[3] ?? m[4]);
  return result;
}
function tags(html, name) {
  return [...html.matchAll(new RegExp('<' + name + '\\b(?:[^"\'<>]|"[^"]*"|\'[^\']*\')*>', 'gi'))].map(m => attrs(m[0]));
}
const plain = value => decode(value.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
const absolute = value => typeof value === 'string' && /^https?:\/\//.test(value);
function parseHTML(html) {
  const titles = [...html.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)].map(m => plain(m[1]));
  const meta = tags(html, 'meta');
  const descriptions = meta.filter(m => m.name?.toLowerCase() === 'description').map(m => m.content || '');
  const canonicals = tags(html, 'link').filter(m => m.rel?.toLowerCase().split(/\s+/).includes('canonical')).map(m => m.href || '');
  const h1 = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map(m => plain(m[1]));
  const schemaTypes = new Set(), schemaErrors = [], schemas = [];
  function inspect(value) {
    if (Array.isArray(value)) { value.forEach(inspect); return; }
    if (!value || typeof value !== 'object') return;
    const types = Array.isArray(value['@type']) ? value['@type'] : [value['@type']];
    types.filter(t => typeof t === 'string').forEach(t => schemaTypes.add(t));
    if (Object.hasOwn(value, 'citation')) {
      const citations = Array.isArray(value.citation) ? value.citation : [value.citation];
      if (citations.some(c => !absolute(c) && !(c && typeof c === 'object' && (absolute(c.url) || typeof c.name === 'string')))) schemaErrors.push('invalid_citation');
    }
    if (types.includes('BreadcrumbList')) {
      const items = value.itemListElement;
      if (!Array.isArray(items) || items.length < 2 || items.some((item, i) => !item || item.position !== i + 1 || typeof item.name !== 'string' || !item.name.trim() || (i < items.length - 1 && !absolute(typeof item.item === 'object' ? item.item?.['@id'] : item.item)))) schemaErrors.push('invalid_breadcrumb');
    }
    Object.values(value).forEach(v => { if (v && typeof v === 'object') inspect(v); });
  }
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (attrs(m[1]).type?.toLowerCase() !== 'application/ld+json') continue;
    try {
      const schema = JSON.parse(m[2]);
      if (!schema || typeof schema !== 'object') schemaErrors.push('invalid_jsonld_value');
      else { schemas.push(schema); inspect(schema); }
    } catch { schemaErrors.push('invalid_jsonld_json'); }
  }
  return {title:titles[0] || '', titleCount:titles.length, description:descriptions[0] || '', descriptionCount:descriptions.length,
    canonical:canonicals[0] || '', canonicalCount:canonicals.length, h1Count:h1.length, h1:h1.map(t => t.slice(0, 300)),
    robots:meta.filter(m => ['robots', 'googlebot'].includes(m.name?.toLowerCase())).map(m => m.content || ''),
    schemaTypes:[...schemaTypes].sort(), schemaBlocks:schemas.length, schemaErrors:[...new Set(schemaErrors)],
    links:tags(html, 'a').map(a => a.href).filter(Boolean), ids:new Set(tags(html, '[a-z][a-z0-9:-]*').map(t => t.id).filter(Boolean))};
}
function safeRoute(value) {
  try {
    const url = new URL(value, ORIGIN);
    if (url.origin !== ORIGIN || url.search) return null;
    const decoded = decodeURIComponent(url.pathname);
    if (BLOCKED.test(decoded) || decoded.split('/').some(p => p.startsWith('.')) || /[\\\0]/.test(decoded)) return null;
    return url.pathname;
  } catch { return null; }
}
function localFile(route) {
  let file = path.resolve(ROOT, '.' + decodeURIComponent(route));
  if (!file.startsWith(ROOT + path.sep) && file !== ROOT) return null;
  if (route.endsWith('/') || (fs.existsSync(file) && fs.statSync(file).isDirectory())) file = path.join(file, 'index.html');
  if (fs.existsSync(file) && !fs.realpathSync(file).startsWith(ROOT + path.sep)) return null;
  return file;
}
function robotsRules(text) {
  const groups = []; let group = null, hasRules = false;
  for (const raw of text.split(/\r?\n/).slice(0, 2000)) {
    const line = raw.replace(/#.*/, '').trim(), pos = line.indexOf(':');
    if (pos < 0) continue;
    const key = line.slice(0, pos).trim().toLowerCase(), value = line.slice(pos + 1).trim();
    if (key === 'user-agent') {
      if (!group || hasRules) { group = {agents:[], rules:[]}; groups.push(group); hasRules = false; }
      group.agents.push(value.toLowerCase());
    } else if (group && ['allow', 'disallow'].includes(key)) { group.rules.push({allow:key === 'allow', value}); hasRules = true; }
  }
  const specific = groups.filter(g => g.agents.includes('googlebot'));
  return (specific.length ? specific : groups.filter(g => g.agents.includes('*'))).flatMap(g => g.rules);
}
function allowedByRobots(route, rules) {
  let best = {length:-1, allow:true};
  for (const rule of rules) {
    if (!rule.value) continue;
    const end = rule.value.endsWith('$'), value = end ? rule.value.slice(0, -1) : rule.value;
    const pattern = '^' + value.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + (end ? '$' : '');
    if (new RegExp(pattern).test(route) && (value.length > best.length || value.length === best.length && rule.allow)) best = {length:value.length, allow:rule.allow};
  }
  return best.allow;
}
async function getLive(url, follow = true) {
  let current = url; const redirects = [];
  for (let n = 0; n < 5; n++) {
    try {
      const response = await fetch(current, {method:'GET', redirect:'manual', credentials:'omit', cache:'no-store',
        signal:AbortSignal.timeout(10000), headers:{'User-Agent':'SubsidieReady-readonly-seo-audit/1.0'}});
      const headers = {'content-type':response.headers.get('content-type') || '', 'x-robots-tag':response.headers.get('x-robots-tag') || ''};
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const raw = response.headers.get('location');
        let target; try { if (raw) target = new URL(raw, current); } catch {}
        const safe = !!target && target.origin === ORIGIN && !target.search && !target.hash && !!safeRoute(target.href);
        await response.body?.cancel();
        const redirect = {status:response.status, to:safe ? target.href : null, safe}; redirects.push(redirect);
        if (!follow) return {status:response.status, headers, bytes:0, text:'', finalUrl:current, redirects};
        if (!safe) return {status:response.status, headers, bytes:0, text:'', finalUrl:current, redirects, error:'unsafe_or_missing_redirect'};
        current = target.href; continue;
      }
      const chunks = []; let bytes = 0;
      if (response.body) {
        const reader = response.body.getReader();
        try {
          for (;;) {
            const {done, value} = await reader.read(); if (done) break;
            bytes += value.byteLength;
            if (bytes > MAX_BYTES) { await reader.cancel(); return {status:response.status, bytes, finalUrl:current, redirects, error:'response_too_large'}; }
            chunks.push(Buffer.from(value));
          }
        } finally { reader.releaseLock(); }
      }
      return {status:response.status, headers, bytes, text:Buffer.concat(chunks).toString('utf8'), finalUrl:current, redirects};
    } catch (error) {
      return {status:null, bytes:0, finalUrl:current, redirects, error:error?.name === 'TimeoutError' ? 'timeout' : 'network_unavailable'};
    }
  }
  return {status:null, bytes:0, finalUrl:current, redirects, error:'redirect_limit'};
}
async function getLocal(route) {
  const file = localFile(route);
  try {
    const stat = fs.statSync(file);
    if (!stat.isFile()) return {status:404, bytes:0, text:'', headers:{}};
    if (stat.size > MAX_BYTES) return {status:200, bytes:stat.size, error:'response_too_large'};
    return {status:200, bytes:stat.size, text:fs.readFileSync(file, 'utf8'), headers:{}, finalUrl:ORIGIN + route, redirects:[]};
  } catch { return {status:404, bytes:0, text:'', headers:{}, finalUrl:ORIGIN + route, redirects:[]}; }
}
async function audit({live = false} = {}) {
  const report = {checkedAt:new Date().toISOString(), mode:live ? 'live' : 'local', origin:ORIGIN,
    statusBasis:live ? 'Observed HTTP response' : 'Local file presence; not a hosting response',
    scope:'Technical crawl evidence only. No claim of actual search indexing, rankings, visitors or Core Web Vitals. GET only; no cookies, forms or off-site crawl.',
    limits:{maxRoutes:MAX_ROUTES, maxResponseBytes:MAX_BYTES, timeoutMs:10000, concurrency:CONCURRENCY},
    version:null, sitemap:null, robots:null, routes:[], redirectProbes:[], errors:[], warnings:[], unknown:[], ok:false};
  const get = route => live ? getLive(ORIGIN + route) : getLocal(route);
  const add = (level, route, code) => { if (!report[level].some(item => item.route === route && item.code === code)) report[level].push({route, code}); };
  const [version, sitemap, robots] = await Promise.all([get('/version.json'), get('/sitemap.xml'), get('/robots.txt')]);
  try {
    const v = JSON.parse(version.text);
    report.version = Object.fromEntries(['product', 'version', 'build', 'source_checked', 'documents'].filter(k => typeof v[k] === 'string').map(k => [k, v[k]]));
    if (v.product !== 'SubsidieReady') add('errors', '/version.json', 'unexpected_product');
  } catch { add(version.error ? 'unknown' : 'errors', '/version.json', version.error || 'invalid_version_json'); }
  const urls = [...(sitemap.text || '').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => decode(m[1].trim()));
  const publicRoutes = [];
  for (const url of urls) {
    const route = safeRoute(url);
    if (!route || url !== ORIGIN + route) { add('errors', '/sitemap.xml', 'noncanonical_or_unsafe_sitemap_url'); continue; }
    if (publicRoutes.includes(route)) add('errors', route, 'duplicate_sitemap_url'); else publicRoutes.push(route);
    if (REVIEW_ROUTES.includes(route)) add('errors', route, 'review_route_in_sitemap');
  }
  if (sitemap.status !== 200 || !urls.length) add(sitemap.error ? 'unknown' : 'errors', '/sitemap.xml', sitemap.error || 'missing_or_empty_sitemap');
  if (sitemap.status === 200 && !publicRoutes.includes('/')) add('errors', '/sitemap.xml', 'homepage_missing');
  report.sitemap = {status:sitemap.status, urlCount:urls.length, urls:publicRoutes.map(route => ORIGIN + route)};
  const rules = robotsRules(robots.text || '');
  report.robots = {status:robots.status, sitemapAdvertised:(robots.text || '').includes(ORIGIN + '/sitemap.xml'), googlebotRules:rules};
  if (robots.status !== 200) add(robots.error ? 'unknown' : 'errors', '/robots.txt', robots.error || 'robots_unavailable');
  else if (!report.robots.sitemapAdvertised) add('warnings', '/robots.txt', 'sitemap_not_advertised');
  const queue = [...new Set([...publicRoutes, ...REVIEW_ROUTES, ...HELP_ROUTES])], parsed = new Map(), raw = new Map();
  if (queue.length > MAX_ROUTES) { queue.length = MAX_ROUTES; add('errors', '/sitemap.xml', 'route_limit'); }
  for (let offset = 0; offset < queue.length; offset += CONCURRENCY) {
    await Promise.all(queue.slice(offset, offset + CONCURRENCY).map(async route => {
      const response = await get(route); raw.set(route, response);
      if (response.status !== 200 || response.error) { add(response.error ? 'unknown' : 'errors', route, response.error || 'http_' + response.status); return; }
      if (live && !/text\/html/i.test(response.headers['content-type'])) { add('errors', route, 'not_html'); return; }
      const data = parseHTML(response.text); parsed.set(route, data);
      for (const href of data.links) {
        let target; try { target = new URL(href, ORIGIN + route); } catch { continue; }
        const candidate = safeRoute(target.href);
        if (!candidate || queue.includes(candidate) || /\.[a-z0-9]+$/i.test(candidate) && !candidate.endsWith('.html')) continue;
        if (queue.length < MAX_ROUTES) queue.push(candidate); else add('warnings', route, 'linked_route_not_crawled_limit');
      }
    }));
  }
  for (const route of queue) {
    const response = raw.get(route), data = parsed.get(route), isPublic = publicRoutes.includes(route);
    const record = {route, inSitemap:isPublic, expectedIndexing:isPublic ? 'public' : REVIEW_ROUTES.includes(route) || HELP_ROUTES.includes(route) ? 'noindex_review' : 'not_listed',
      status:response?.status ?? null, finalUrl:response?.finalUrl || ORIGIN + route, redirects:response?.redirects || [], rawHTMLBytes:response?.bytes || 0};
    if (!data) { record.error = response?.error || 'not_inspected'; report.routes.push(record); continue; }
    const noindex = /\b(?:noindex|none)\b/i.test([...data.robots, response.headers['x-robots-tag'] || ''].join(','));
    const crawlAllowed = robots.status === 200 ? allowedByRobots(route, rules) : null;
    Object.assign(record, {title:data.title.slice(0, 300), titleCount:data.titleCount, description:data.description.slice(0, 500), descriptionCount:data.descriptionCount,
      canonical:data.canonical, canonicalCount:data.canonicalCount, robots:data.robots, xRobotsTag:response.headers['x-robots-tag'] || '',
      crawlAllowed, noindex, h1Count:data.h1Count, h1:data.h1, schemaTypes:data.schemaTypes, schemaBlocks:data.schemaBlocks, missingLocalLinks:[]});
    if (isPublic) {
      if (data.titleCount !== 1 || !data.title) add('errors', route, 'missing_or_duplicate_title');
      if (data.descriptionCount !== 1 || !data.description) add('errors', route, 'missing_or_duplicate_description');
      if (data.canonicalCount !== 1 || data.canonical !== ORIGIN + route) add('errors', route, 'canonical_mismatch');
      if (data.h1Count !== 1) add('errors', route, 'h1_count_' + data.h1Count);
      if (noindex || crawlAllowed === false) add('errors', route, 'public_page_blocked');
      if (!data.schemaBlocks) add('warnings', route, 'structured_data_absent');
    } else if (record.expectedIndexing === 'noindex_review' && !noindex) add('errors', route, 'review_noindex_missing');
    data.schemaErrors.forEach(code => add('errors', route, code));
    for (const href of data.links) {
      let target; try { target = new URL(href, ORIGIN + route); } catch { continue; }
      const dest = safeRoute(target.href); if (!dest) continue;
      const key = dest + target.hash;
      if (DYNAMIC_ANCHORS.has(key) || href === '#') continue;
      let reason = null;
      if (raw.has(dest) && raw.get(dest).status === 404) reason = 'target_not_found';
      else if (!live && !fs.existsSync(localFile(dest))) reason = 'target_not_found';
      else if (target.hash && parsed.has(dest)) {
        try { if (!parsed.get(dest).ids.has(decodeURIComponent(target.hash.slice(1)))) reason = 'anchor_not_found'; }
        catch { reason = 'invalid_anchor'; }
      }
      if (reason && !record.missingLocalLinks.some(item => item.href === key)) record.missingLocalLinks.push({href:key, reason});
    }
    if (record.missingLocalLinks.length) add(isPublic ? 'errors' : 'warnings', route, 'broken_internal_links');
    report.routes.push(record);
  }
  for (const field of ['title', 'description']) {
    const groups = new Map();
    for (const page of report.routes.filter(r => r.inSitemap && r[field])) { const value = page[field]; groups.set(value, [...(groups.get(value) || []), page.route]); }
    for (const routes of groups.values()) if (routes.length > 1) routes.forEach(route => add('warnings', route, 'duplicate_public_' + field));
  }
  if (live) {
    report.redirectProbes = await Promise.all(['http://subsidieready.nl/', 'https://www.subsidieready.nl/'].map(async url => {
      const result = await getLive(url, false), redirect = result.redirects[0];
      const verified = result.error ? null : !!redirect && [301, 308].includes(redirect.status) && redirect.to === ORIGIN + '/';
      if (verified === null) add('unknown', url, result.error); else if (!verified) add('warnings', url, 'canonical_redirect_not_confirmed');
      return {url, status:result.status, redirectTo:redirect?.to || null, verified};
    }));
  }
  report.routes.sort((a, b) => a.route.localeCompare(b.route));
  report.summary = {sitemapRoutes:publicRoutes.length, inspectedPages:parsed.size, errors:report.errors.length, warnings:report.warnings.length, unknown:report.unknown.length};
  report.ok = !report.errors.length && !report.unknown.length;
  return report;
}
module.exports = {audit, parseHTML, robotsRules, allowedByRobots, safeRoute};
if (require.main === module) {
  if (process.argv.slice(2).some(arg => arg !== '--live')) { console.error('Usage: node scripts/audit-seo.cjs [--live]'); process.exitCode = 2; }
  else audit({live:process.argv.includes('--live')}).then(report => {
    const output = path.join(ROOT, 'qa', report.mode === 'live' ? 'seo-live.json' : 'seo-local.json');
    fs.mkdirSync(path.dirname(output), {recursive:true}); fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify({report:path.relative(ROOT, output), mode:report.mode, build:report.version?.build, ...report.summary, ok:report.ok}));
    for (const issue of report.errors) console.log('ERROR ' + issue.route + ' ' + issue.code);
    process.exitCode = report.errors.length ? 1 : report.unknown.length ? 2 : 0;
  }).catch(() => { console.error('SEO audit could not complete; no indexing status has been inferred.'); process.exitCode = 2; });
}
