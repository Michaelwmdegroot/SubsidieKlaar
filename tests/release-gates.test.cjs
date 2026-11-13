'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

test('both entrypoints remain noindex until a deliberate launch', () => {
  const source = read('index.html');
  const standalone = read('concept/SubsidieKlaar-concept.html');
  const robots = read('robots.txt');

  for (const [name, html] of [['source', source], ['standalone', standalone]]) {
    assert.match(html, /<meta\s+name="robots"\s+content="noindex,\s*nofollow"/i, name);
  }
  assert.match(robots, /^User-agent:\s*\*\s*$/im);
  assert.match(robots, /^Disallow:\s*\/\s*$/im);
});

test('development entrypoint loads no remote executable assets', () => {
  const html = read('index.html');
  const tags = [...html.matchAll(/<(?:script|link)\b[^>]*\b(?:src|href)="([^"]+)"/gi)];
  assert.ok(tags.length >= 3, 'expected local JavaScript, CSS and icon assets');
  for (const [, address] of tags) {
    assert.ok(!/^(?:https?:)?\/\//i.test(address), 'remote asset: ' + address);
    assert.ok(!address.startsWith('/'), 'unexpected root-absolute asset: ' + address);
    const file = path.resolve(root, address);
    assert.ok(file.startsWith(root + path.sep), 'path escapes repository: ' + address);
    assert.ok(fs.existsSync(file), 'missing local asset: ' + address);
  }
});

test('portable concept inlines scripts, font and icon with no local asset fetch', () => {
  const html = read('concept/SubsidieKlaar-concept.html');
  assert.doesNotMatch(html, /<script\b[^>]*\bsrc\s*=/i);
  assert.doesNotMatch(html, /<link\b[^>]*rel="stylesheet"[^>]*href=/i);
  assert.doesNotMatch(html, /(?:src|href)="(?:\.\.?\/)?(?:assets|vendor)\//i);
  assert.match(html, /data:font\/ttf;base64,/i);
  assert.match(html, /data:image\/svg\+xml;base64,/i);
  assert.match(html, /Third-party license notices/);
});
