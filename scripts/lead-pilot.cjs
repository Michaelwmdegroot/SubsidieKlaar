'use strict';

// Build-time preparation only. No browser code, network, storage or lead intake.
// Evidence references record a reviewed decision; syntax cannot certify that decision.
const defaultConfig = require('./lead-pilot.config.json');
Object.freeze(defaultConfig.approvals);
Object.freeze(defaultConfig);

const RECIPIENT = 'Thuisbatterij Team B.V.';
const TARGET_URL = 'https://thuisbatterijteam.nl/contact/adviesgesprek/';
const PRIVACY_URL = 'https://thuisbatterijteam.nl/voorwaarden-beleid/privacybeleid/';
const FIELDS = ['enabled', 'recipient', 'targetUrl', 'privacyUrl', 'approvals'];
const APPROVALS = ['controller', 'relationship', 'recipient', 'formAndPrivacy', 'receipt', 'ownerPublication'];
// An inspectable decision in this project's issue or PR, never a bool or generic "approved".
const EVIDENCE = /^https:\/\/github\.com\/Michaelwmdegroot\/SubsidieKlaar\/(?:issues\/[1-9]\d*#issuecomment-[1-9]\d*|pull\/[1-9]\d*#(?:issuecomment|pullrequestreview)-[1-9]\d*)$/;

function exactObject(value, keys) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) return false;
  const own = Reflect.ownKeys(value);
  return own.length === keys.length && own.every(key => keys.includes(key)) &&
    keys.every(key => Object.hasOwn(value, key) && 'value' in Object.getOwnPropertyDescriptor(value, key));
}

function inspect(config) {
  if (!exactObject(config, FIELDS)) throw new TypeError('Leadpilot: onbekende of ontbrekende configuratievelden.');
  if (typeof config.enabled !== 'boolean') throw new TypeError('Leadpilot: enabled moet een boolean zijn.');
  if (config.recipient !== RECIPIENT) throw new TypeError('Leadpilot: ontvanger staat niet op de vaste allowlist.');
  if (config.targetUrl !== TARGET_URL || config.privacyUrl !== PRIVACY_URL) {
    throw new TypeError('Leadpilot: alleen de vaste advies- en privacy-URL zonder parameters zijn toegestaan.');
  }
  if (!exactObject(config.approvals, APPROVALS)) throw new TypeError('Leadpilot: ongeldige goedkeuringsvelden.');
  const missingApprovals = [];
  for (const key of APPROVALS) {
    const evidence = config.approvals[key];
    if (evidence === null) missingApprovals.push(key);
    else if (typeof evidence !== 'string' || evidence.length > 240 || !EVIDENCE.test(evidence)) {
      throw new TypeError('Leadpilot: bewijs moet een concrete projectcomment of PR-review zijn.');
    }
  }
  const status = !config.enabled ? 'disabled' : missingApprovals.length ? 'blocked' : 'ready';
  return {status, missingApprovals, renderAllowed: status === 'ready'};
}

function report(config = defaultConfig) {
  // Deliberately omit all config/evidence values from CLI output and reports.
  return inspect(config);
}

function validate(config = defaultConfig) {
  const result = inspect(config);
  if (result.status === 'blocked') {
    throw new Error('Leadpilot blijft geblokkeerd; ontbrekend bewijs: ' + result.missingApprovals.join(', ') + '.');
  }
  return result;
}

function render(config = defaultConfig) {
  const result = validate(config);
  if (result.status !== 'ready') return '';
  // Render only fixed allowlisted constants, never decision IDs or configurable HTML.
  return `<aside class="info-box" aria-labelledby="lead-pilot-title" style="min-width:0;max-width:100%;box-sizing:border-box;overflow-wrap:anywhere">
  <p class="eyebrow">Commercieel productadvies</p>
  <h2 id="lead-pilot-title">Past een thuisbatterij bij jouw woning?</h2>
  <p>Vraag een vrijblijvend adviesgesprek aan bij <strong>${RECIPIENT}</strong>. Je vult je contactgegevens zelf in op hun website.</p>
  <div class="button-row" style="box-sizing:border-box;display:grid;grid-template-columns:minmax(0,1fr);gap:10px;max-width:100%;min-width:0;padding:0;border:0;background:transparent">
    <a class="btn btn-secondary" style="white-space:normal;overflow-wrap:anywhere;min-width:0;max-width:100%;box-sizing:border-box;text-align:center" href="${TARGET_URL}" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer">Vraag thuisbatterijadvies aan<span class="visually-hidden"> bij ${RECIPIENT} (opent een nieuw tabblad)</span></a>
    <a style="white-space:normal;overflow-wrap:anywhere;min-width:0;max-width:100%;box-sizing:border-box" href="${PRIVACY_URL}" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer">Privacy bij ${RECIPIENT}<span class="visually-hidden"> (opent een nieuw tabblad)</span></a>
  </div>
  <p>Dit is productadvies, geen beoordeling van je recht op subsidie of btw-teruggaaf. SubsidieReady stuurt geen ingevulde antwoorden of documenten mee. De gratis check en downloads blijven beschikbaar.</p>
</aside>`;
}

module.exports = {validate, render, report};

if (require.main === module) {
  if (process.argv.length !== 3 || process.argv[2] !== '--check') {
    process.stderr.write('Gebruik: node scripts/lead-pilot.cjs --check\n');
    process.exitCode = 2;
  } else {
    try {
      const result = report();
      process.stdout.write(JSON.stringify(result, null, 2) + '\n');
      if (result.status === 'blocked') process.exitCode = 1;
    } catch (error) {
      process.stderr.write(error.message + '\n');
      process.exitCode = 1;
    }
  }
}
