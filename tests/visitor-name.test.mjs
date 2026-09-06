import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { clearVisitorName, readVisitorName, saveVisitorName, visitorNameKey } from '../src/scripts/visitor-name.mjs';

function storage() {
  const values = new Map();
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) };
}

test('stores only a trimmed, valid visitor name under one local key', () => {
  globalThis.localStorage = storage();
  assert.equal(saveVisitorName('  Abdul Haque  '), true);
  assert.equal(localStorage.getItem(visitorNameKey), 'Abdul Haque');
  assert.equal(readVisitorName(), 'Abdul Haque');
  assert.equal(saveVisitorName(' '.repeat(3)), false);
  assert.equal(saveVisitorName('a'.repeat(121)), false);
  delete globalThis.localStorage;
});

test('clears the locally saved name so it can be replaced', () => {
  globalThis.localStorage = storage();
  saveVisitorName('Abdul Haque');
  assert.equal(clearVisitorName(), true);
  assert.equal(readVisitorName(), null);
  delete globalThis.localStorage;
});

test('unavailable or malformed browser storage never blocks the visitor', () => {
  globalThis.localStorage = { getItem: () => 'a'.repeat(121), setItem() { throw Error('blocked'); } };
  assert.equal(readVisitorName(), null);
  assert.equal(saveVisitorName('Abdul Haque'), false);
  delete globalThis.localStorage;
});

test('map return controls explicitly request the editable introduction', () => {
  const onboarding = readFileSync(new URL('../src/pages/onboarding.astro', import.meta.url), 'utf8');
  const map = readFileSync(new URL('../src/components/StarMap.astro', import.meta.url), 'utf8');
  assert.match(onboarding, /href="\/\?edit=1"/);
  assert.match(map, /href="\/\?edit=1"/);
});

test('home onboarding action validates and explains a missing name', () => {
  const intro = readFileSync(new URL('../src/pages/index.astro', import.meta.url), 'utf8');
  assert.match(intro, /onboarding\?\.addEventListener\('click'/);
  assert.match(intro, /mode = 'name-only';\s*if \(!showErrors\(true\)\) return;/);
  assert.match(intro, /saveVisitorName\(name\.value\);\s*location\.assign\(onboarding\.href\)/);
});
