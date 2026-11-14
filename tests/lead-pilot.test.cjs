'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const {execFileSync} = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');
const pilot = require('../scripts/lead-pilot.cjs');
const configuration = () => JSON.parse(fs.readFileSync(path.join(__dirname, '../scripts/lead-pilot.config.json'), 'utf8'));
const keys = ['controller', 'relationship', 'recipient', 'formAndPrivacy', 'receipt', 'ownerPublication'];

function syntheticApprovedConfig() {
  const config = configuration();
  config.enabled = true;
  // TEST FIXTURE ONLY: these syntactically valid URLs are not actual owner approvals.
  // They must never be copied to the production configuration or release evidence.
  for (const [index, key] of keys.entries()) {
    config.approvals[key] = 'https://github.com/Michaelwmdegroot/SubsidieKlaar/issues/5#issuecomment-' + (index + 1);
  }
  return config;
}

test('lead pilot: committed default is disabled and has no approval evidence', () => {
  const config = configuration();
  assert.equal(config.enabled, false);
  assert.deepEqual(config.approvals, Object.fromEntries(keys.map(key => [key, null])));
  assert.equal(pilot.render(), '');
  assert.deepEqual(pilot.validate(config), {status: 'disabled', missingApprovals: keys, renderAllowed: false});
});

test('lead pilot: enabling with any missing decision fails closed', () => {
  for (const key of keys) {
    const config = syntheticApprovedConfig();
    config.approvals[key] = null;
    assert.equal(pilot.report(config).status, 'blocked');
    assert.deepEqual(pilot.report(config).missingApprovals, [key]);
    assert.throws(() => pilot.validate(config), /blijft geblokkeerd/);
    assert.throws(() => pilot.render(config), /blijft geblokkeerd/);
  }
});

test('lead pilot: disabled stays empty even with a fully populated synthetic evidence set', () => {
  const config = syntheticApprovedConfig();
  config.enabled = false;
  assert.equal(pilot.render(config), '');
  assert.deepEqual(pilot.report(config), {status: 'disabled', missingApprovals: [], renderAllowed: false});
});

test('lead pilot: free text, booleans, generic issue URLs and evidence from another repository cannot approve', () => {
  for (const evidence of [true, false, 1, '', 'approved', 'owner said yes',
    'https://github.com/Michaelwmdegroot/SubsidieKlaar/issues/5',
    'https://github.com/Michaelwmdegroot/SubsidieKlaar/issues/5#pullrequestreview-1',
    'https://github.com/other/repository/issues/5#issuecomment-1',
    'https://github.com/Michaelwmdegroot/SubsidieKlaar/issues/5#issuecomment-1?email=test@example.invalid']) {
    const config = syntheticApprovedConfig();
    config.approvals.controller = evidence;
    assert.throws(() => pilot.render(config), /bewijs/);
  }
});

test('lead pilot: arbitrary destinations, tracking parameters, fragments and credential URLs are rejected', () => {
  for (const field of ['targetUrl', 'privacyUrl']) {
    const base = configuration()[field];
    for (const unsafe of ['https://example.invalid/', base + '?utm_source=test', base + '#plan',
      base.replace('https:', 'http:'), base.replace('https://', 'https://user@'),
      base.replace('thuisbatterijteam.nl', 'thuisbatterijteam.nl.example.invalid'), base + '\n']) {
      const config = syntheticApprovedConfig();
      config[field] = unsafe;
      assert.throws(() => pilot.render(config), /vaste advies- en privacy-URL/);
      config.enabled = false;
      assert.throws(() => pilot.validate(config), /vaste advies- en privacy-URL/);
    }
  }
});

test('lead pilot: boolean flag, exact recipient and strict fields prevent permissive configuration', () => {
  for (const enabled of ['true', 'false', 1, 0, null]) {
    const config = configuration();
    config.enabled = enabled;
    assert.throws(() => pilot.validate(config), /boolean/);
  }
  const wrongRecipient = configuration();
  wrongRecipient.recipient = 'Andere B.V.';
  assert.throws(() => pilot.render(wrongRecipient), /ontvanger/);
  const extra = configuration();
  extra.trackingUrl = 'https://example.invalid/';
  assert.throws(() => pilot.validate(extra), /configuratievelden/);
  const extraApproval = configuration();
  extraApproval.approvals.all = true;
  assert.throws(() => pilot.validate(extraApproval), /goedkeuringsvelden/);
  const missing = configuration();
  delete missing.approvals.receipt;
  assert.throws(() => pilot.render(missing), /goedkeuringsvelden/);
  assert.throws(() => pilot.validate(null), /configuratievelden/);
});

test('lead pilot: synthetic approved fixture renders two safe ordinary links and clear commercial context', () => {
  const config = syntheticApprovedConfig();
  const html = pilot.render(config);
  assert.equal(pilot.validate(config).status, 'ready');
  assert.match(html, /<aside class="info-box" aria-labelledby="lead-pilot-title">/);
  assert.match(html, /Commercieel productadvies/);
  assert.match(html, /Thuisbatterij Team B\.V\./);
  assert.match(html, /geen ingevulde antwoorden of documenten mee/);
  assert.match(html, /gratis check en downloads blijven beschikbaar/);
  const links = [...html.matchAll(/<a\b([^>]+)href="([^"]+)"([^>]*)>/g)];
  assert.deepEqual(links.map(match => match[2]), [config.targetUrl, config.privacyUrl]);
  for (const [, before, url, after] of links) {
    const attributes = before + after;
    assert.equal(new URL(url).search, '');
    assert.equal(new URL(url).hash, '');
    assert.match(attributes, /rel="noopener noreferrer"/);
    assert.match(attributes, /referrerpolicy="no-referrer"/);
    assert.match(attributes, /target="_blank"/);
  }
  assert.doesNotMatch(html, /<script|<iframe|<form|<input|<img|<link|on(?:click|load|error)=|data-metrics|fetch\(|sendBeacon|localStorage|sessionStorage/);
  assert.doesNotMatch(html, /issuecomment|pullrequestreview|approved/);
});

test('lead pilot: report discloses statuses only, without approval values or configuration', () => {
  const config = syntheticApprovedConfig();
  assert.deepEqual(pilot.report(config), {status: 'ready', missingApprovals: [], renderAllowed: true});
  assert.doesNotMatch(JSON.stringify(pilot.report(config)), /https|issuecomment|recipient|controller|@/);
});

test('lead pilot: CLI checks disabled configuration without rendering or collecting anything', () => {
  const cli = path.join(__dirname, '../scripts/lead-pilot.cjs');
  const output = execFileSync(process.execPath, [cli, '--check'], {encoding: 'utf8'});
  assert.deepEqual(JSON.parse(output), {status: 'disabled', missingApprovals: keys, renderAllowed: false});
  assert.doesNotMatch(output, /https|<a |@|issuecomment/);
});
