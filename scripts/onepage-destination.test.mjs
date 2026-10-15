import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const homepage = read('index.html');
const fallback = read('onepage/index.html');
const matchesLandingPage = (host, path) =>
  ['bairatlabs.com', 'www.bairatlabs.com'].includes(host) &&
  ['/onepage', '/onepage/', '/onepage/index.html'].includes(path);

test('company homepage links directly to the official OnePage site', () => {
  assert.equal((homepage.match(/href="https:\/\/tryonepage\.com\/"/g) ?? []).length, 4);
  assert.doesNotMatch(homepage, /href="\/onepage\/?"/);
  assert.match(homepage, /Visit OnePage co-parenting app/);
  assert.match(homepage, /href="\/onepage\/privacy"/);
});

test('static origin fallback declares the same immediate redirect and canonical', () => {
  assert.match(fallback, /<link rel="canonical" href="https:\/\/tryonepage\.com\/">/);
  assert.match(fallback, /<meta http-equiv="refresh" content="0;url=https:\/\/tryonepage\.com\/">/);
  assert.match(fallback, /href="https:\/\/tryonepage\.com\/"/);
  assert.doesNotMatch(fallback, /<script|noindex|Shared expenses|Free for iOS/i);
});

test('support and legal routes remain present', () => {
  for (const path of ['onepage/privacy/index.html', 'onepage/delete-account/index.html']) {
    assert.ok(read(path).includes('<html'));
    assert.ok(fallback.includes(`href="/${path.replace('index.html', '')}"`));
  }
  assert.match(fallback, /https:\/\/tryonepage\.com\/contact/);
});

test('edge scope model matches only three landing aliases on known hosts', () => {
  for (const host of ['bairatlabs.com', 'www.bairatlabs.com']) {
    for (const path of ['/onepage', '/onepage/', '/onepage/index.html']) {
      assert.equal(matchesLandingPage(host, path), true);
    }
    for (const path of ['/', '/onepage/privacy', '/onepage/privacy/', '/onepage/delete-account/', '/onepage/other', '/zuppy', '/onepage-other']) {
      assert.equal(matchesLandingPage(host, path), false);
    }
  }
  assert.equal(matchesLandingPage('onepage.bairatlabs.com', '/onepage'), false);
});
