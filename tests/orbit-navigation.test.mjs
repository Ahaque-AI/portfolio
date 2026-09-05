import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { runInNewContext } from 'node:vm';

const script = ts.transpileModule(readFileSync(new URL('../src/scripts/orbit-navigation.ts', import.meta.url), 'utf8'), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
}).outputText.replace(/export\s*\{\s*\};?/g, '')
  .replace("import('./orbital-three')", 'loadThree()');
function setup({ reduced = false, gpuFails = false } = {}) {
  const handlers = {};
  const calls = [];
  const main = { inert: false, setAttribute() {}, focus() { calls.push('focus'); } };
  const flight = {
    cover: async () => { calls.push('cover'); },
    reveal: async () => { calls.push('reveal'); },
    dispose: () => { calls.push('dispose'); },
  };
  runInNewContext(script, {
    matchMedia: () => ({ matches: reduced, addEventListener() {} }),
    addEventListener() {},
    document: {
      addEventListener: (name, handler) => { handlers[name] = handler; },
      querySelectorAll: () => [],
      querySelector: name => name === 'main' ? main : {},
    },
    loadThree: async () => ({ createFlight() { if (gpuFails) throw Error('No GPU'); calls.push('create'); return flight; } }),
  });
  const prepare = (options = {}) => {
    const controller = new AbortController();
    const event = {
      from: new URL('https://portfolio.test/'), to: new URL('https://portfolio.test/onboarding/'),
      navigationType: 'push', signal: controller.signal,
      loader: async () => { calls.push('load'); },
      preventDefault() { this.defaultPrevented = true; },
      ...options,
    };
    handlers['astro:before-preparation'](event);
    return { event, controller };
  };
  return { handlers, calls, prepare };
}

test('loads the real page before covering, then reveals and disposes the scene', async () => {
  const { prepare, calls, handlers } = setup();
  const { event } = prepare();
  await event.loader();
  assert.deepEqual(calls, ['load', 'create', 'cover']);
  handlers['astro:before-swap']({ viewTransition: { skipTransition() { calls.push('skip snapshot'); } } });
  handlers['astro:page-load']();
  await new Promise(resolve => setImmediate(resolve));
  assert.deepEqual(calls.slice(3), ['skip snapshot', 'reveal', 'dispose', 'focus']);
});

test('reduced motion and history traversal never construct a renderer', async () => {
  for (const reduced of [true, false]) {
    const { prepare, calls } = setup({ reduced });
    const { event } = prepare(reduced ? {} : { navigationType: 'traverse' });
    await event.loader();
    assert.deepEqual(calls, ['load']);
  }
});

test('the flight also covers the CV page in both directions', async () => {
  const { prepare, calls } = setup();
  await prepare({ to: new URL('https://portfolio.test/cv/') }).event.loader();
  assert.deepEqual(calls, ['load', 'create', 'cover']);
  await prepare({ from: new URL('https://portfolio.test/cv/'), to: new URL('https://portfolio.test/onboarding/') }).event.loader();
  assert.deepEqual(calls.slice(-3), ['load', 'create', 'cover']);
});

test('WebGL failure requests native navigation instead of trapping the link', async () => {
  const { prepare } = setup({ gpuFails: true });
  const { event } = prepare();
  await event.loader();
  assert.equal(event.defaultPrevented, true);
});

test('an aborted slow navigation cannot dispose a newer flight', async () => {
  const { prepare, calls } = setup();
  let finishOldLoad;
  const old = prepare({ loader: () => new Promise(resolve => { finishOldLoad = resolve; }) });
  const pending = old.event.loader();
  old.controller.abort();
  const next = prepare();
  await next.event.loader();
  finishOldLoad();
  await pending;
  assert.equal(calls.filter(call => call === 'create').length, 1);
  assert.equal(calls.filter(call => call === 'dispose').length, 0);
});
