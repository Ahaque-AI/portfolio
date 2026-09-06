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
      classList: { add() {}, remove() {} }, setAttribute() {}, removeAttribute() {}, toggleAttribute() {},
      addEventListener(name, handler) { this.handlers[name] = handler; },
      querySelector: element,
      focus() { calls.push(`focus:${id}`); },
      showModal() { this.open = true; },
      close() { this.open = false; this.handlers.close?.(); },
    };
  }
  let resolve;
  const module = { mountSolarSystem(_host, _failure, onTravel) {
    calls.push('mount');
    if (failure) return;
    return { flyTo: index => { onTravel(true); calls.push(index); onTravel(false); }, dispose: () => calls.push('dispose') };
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

test('guided-flight moves between asteroid encounters by explicit sector controls', async () => {
  const { elements: e, calls } = setup();
  await e['#tutorial-trigger'].handlers.click();
  assert.equal(e['#flight-next'].handlers.keydown, undefined, 'native button activation must not advance twice');
  e['#flight-next'].handlers.click();
  e['#flight-next'].handlers.click();
  e['#flight-next'].handlers.click();
  e['#tutorial-dialog'].handlers.keydown({ key: 'ArrowDown', preventDefault() {} });
  assert.deepEqual(calls.filter(value => typeof value === 'number'), [0, 1, 2, 3, 2]);
  e['#tutorial-close'].handlers.click();
  assert.ok(calls.includes('dispose'));
  assert.equal(e['#free-roam'].hidden, true, 'free exploration choice stays hidden after launch');
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

test('guided-flight warms and reuses one scene module request', () => {
  const source = readFileSync(new URL('../src/scripts/guided-flight.ts', import.meta.url), 'utf8');
  assert.match(source, /sceneModule \?\?= import\('\.\/solar-system'\)/);
  assert.match(source, /button\.addEventListener\('focus', warmScene/);
  assert.match(source, /button\.addEventListener\('pointerdown', warmScene/);
  assert.match(source, /await prepareScene\(\)/);
  assert.doesNotMatch(source, /freeRoam\.hidden = false/);
});
