import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

test('portfolio source contains no em dashes or sentence en dashes', () => {
  function check(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) check(path);
      else if (/\.(astro|mjs)$/.test(path)) {
        assert.doesNotMatch(readFileSync(path, 'utf8'), /[\u2013\u2014]|&(?:mdash|ndash|#8211|#8212|#x2013|#x2014);/i, path);
      }
    }
  }
  check('src');
});
