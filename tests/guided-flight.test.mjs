import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { runInNewContext } from 'node:vm';

const script = ts.transpileModule(readFileSync(new URL('../src/scripts/guided-flight.ts', import.meta.url), 'utf8'), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
}).outputText.replace(/export /g, '').replace("import('./solar-system')", 'loadScene()');

function setup({ failure = false, delayed = false } = {}) {
  const calls = [];
  const timers = [];
  const elements = {};
  function element(id) {
    return elements[id] ??= {
      dataset: {}, handlers: {}, isConnected: true, hidden: false,
      classList: { add() {}, remove() {} }, setAttribute() {}, removeAttribute() {},
      addEventListener(name, handler) { this.handlers[name] = handler; },
      querySelector: element,
      focus() { calls.push(`focus:${id}`); },
      showModal() { this.open = true; },
      close() { this.open = false; this.handlers.close?.(); },
    };
  }
  let resolve;
  const module = { mountSolarSystem() {
    calls.push('mount');
    if (failure) return;
    return { flyTo: index => calls.push(index), dispose: () => calls.push('dispose') };
  } };
  runInNewContext(`${script}\ninitGuidedFlight();`, {
    AbortController,
    sessionStorage: { getItem: () => 'true', setItem() {} },
    requestAnimationFrame: callback => callback(),
    clearTimeout() {},
    window: { setTimeout: callback => { timers.push(callback); return timers.length; } },
    document: { body: { classList: { add() {}, remove() {} } }, documentElement: { classList: { add() {}, remove() {} } }, querySelector: element, addEventListener() {} },
    loadScene: () => delayed ? new Promise(done => { resolve = done; }) : Promise.resolve(module),
  });
  return { elements, calls, advance: () => timers.shift()?.(), resolve: () => resolve(module) };
}

test('guided-flight moves between asteroid encounters by scroll and returns through one back control', async () => {
  const { elements: e, calls } = setup();
  await e['#tutorial-trigger'].handlers.click();
  const up = { deltaY: -100, preventDefault() {} };
  e['#tutorial-dialog'].handlers.wheel(up);
  e['#tutorial-dialog'].handlers.wheel(up);
  e['#tutorial-dialog'].handlers.wheel(up);
  assert.deepEqual(calls.filter(value => typeof value === 'number'), [0, 1, 2, 3]);
  e['#tutorial-close'].handlers.click();
  assert.ok(calls.includes('dispose'));
  assert.equal(calls.at(-1), 'focus:#tutorial-trigger');
});

test('WebGL failure keeps the scroll-piloted text encounter usable', async () => {
  const { elements: e } = setup({ failure: true });
  await e['#tutorial-trigger'].handlers.click();
  assert.match(e['#flight-status'].textContent, /Text tour available/);
});

test('closing while the chunk loads never mounts a stale scene', async () => {
  const { elements: e, calls, resolve } = setup({ delayed: true });
  const opening = e['#tutorial-trigger'].handlers.click();
  e['#tutorial-close'].handlers.click();
  resolve(); await opening;
  assert.ok(!calls.includes('mount'));
});
