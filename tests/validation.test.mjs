import test from 'node:test';
import assert from 'node:assert/strict';
import { validateIntroduction } from '../src/scripts/validation.mjs';

test('empty submission explains required details and consent', () => {
  assert.deepEqual(Object.keys(validateIntroduction({ name: ' ', email: '', comment: '', agreement: false })), ['name', 'email', 'agreement']);
});
test('supports international and single names, optional comments', () => {
  for (const name of ['عبدالحق', 'Prince', 'María-José O’Neill']) {
    assert.deepEqual(validateIntroduction({ name, email: 'hello+portfolio@example.com', comment: '', agreement: true }), {});
  }
});
test('rejects invalid email and excessive input even without browser limits', () => {
  const errors = validateIntroduction({ name: 'a'.repeat(121), email: 'a@@example.com', comment: 'x'.repeat(1001), agreement: true });
  assert.deepEqual(Object.keys(errors), ['name', 'email', 'comment']);
});
test('name-only continuation rejects missing names but ignores email and consent', () => {
  const values = { name: '   ', email: '', comment: '', agreement: false };
  assert.deepEqual(Object.keys(validateIntroduction(values, 'name-only')), ['name']);
  assert.deepEqual(validateIntroduction({ ...values, name: 'Abdul Haque' }, 'name-only'), {});
  assert.deepEqual(validateIntroduction({ ...values, name: 'عبدالحق', email: 'unfinished@', comment: 'x'.repeat(1001) }, 'name-only'), {});
  assert.deepEqual(Object.keys(validateIntroduction({ ...values, name: 'a'.repeat(121) }, 'name-only')), ['name']);
});
