import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const THREE = require('three');
const flightOrbit = ts.transpileModule(readFileSync(new URL('../src/scripts/flight-orbit.ts', import.meta.url), 'utf8'), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
}).outputText;
const flightExports = {};
new Function('require', 'exports', flightOrbit)(require, flightExports);
const { makeFlightOrbit } = flightExports;
const compiled = ts.transpileModule(readFileSync(new URL('../src/scripts/orbital-three.ts', import.meta.url), 'utf8'), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
}).outputText;
const exports = {};
new Function('require', 'exports', compiled)(name => name === './flight-orbit' ? flightExports : require(name), exports);
const { disposeScene, pixelRatio } = exports;

const rocketExports = {};
const solarExports = {};
for (const [file, output] of [['rocket', rocketExports], ['solar-system', solarExports]]) {
  const code = ts.transpileModule(readFileSync(new URL(`../src/scripts/${file}.ts`, import.meta.url), 'utf8'), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
  }).outputText;
  new Function('require', 'exports', code)(name => {
    if (name === './orbital-three') return exports;
    if (name === './rocket') return rocketExports;
    return require(name);
  }, output);
}

test('solar scene has deterministic stars, closed tracks and complete disposal', () => {
  const first = solarExports.makeSolarSystem();
  const second = solarExports.makeSolarSystem();
  assert.deepEqual(first.stops.map(stop => stop.id), ['arrival', 'therapy', 'research', 'systems']);
  assert.deepEqual(first.stars.geometry.attributes.position.array, second.stars.geometry.attributes.position.array);
  for (const stop of first.stops) assert.ok(stop.point(0).distanceTo(stop.point(Math.PI * 2)) < 1e-10);
  first.update(19);
  assert.equal(first.comet.visible, true);
  first.update(19, true);
  assert.equal(first.comet.visible, false);
  const position = first.stops[0].group.position.clone();
  first.update(19, true);
  assert.ok(position.equals(first.stops[0].group.position), 'frozen time preserves the planet frame');
  assert.ok(first.rocket.group.children.length >= 7, 'ship has a cockpit, wings and twin engines');
  assert.ok(first.stops.every(stop => stop.rocks.length === 12), 'every stop is an asteroid encounter');
  first.strike(1);
  const rock = first.stops[1].rocks[0];
  const resting = rock.position.clone();
  first.update(0);
  assert.ok(rock.position.distanceTo(resting) > 0, 'an encounter breaks the asteroid field apart');
  let allocated = 0, released = 0;
  first.scene.traverse(object => {
    if (!object.geometry) return;
    assert.ok([...object.geometry.attributes.position.array].every(Number.isFinite));
    allocated += 2;
    object.geometry.addEventListener('dispose', () => released++);
    object.material.addEventListener('dispose', () => released++);
  });
  disposeScene(first.scene);
  disposeScene(second.scene);
  assert.equal(released, allocated);
});

test('spaceship spline reaches each stop with finite positions and headings', () => {
  const system = solarExports.makeSolarSystem();
  let start = system.rocket.group.position.clone();
  for (const index of [0, 2, 1, 2, 0]) {
    const end = system.stops[index].group.position.clone();
    const path = solarExports.makeFlightPath(start, end);
    assert.ok(path.getPointAt(0).distanceTo(start) < 1e-9);
    assert.ok(path.getPointAt(1).distanceTo(end) < 1e-9);
    for (let i = 0; i <= 60; i++) {
      assert.ok(path.getPointAt(i / 60).toArray().every(Number.isFinite));
      assert.ok(path.getTangentAt(i / 60).toArray().every(Number.isFinite));
    }
    start = end;
  }
  disposeScene(system.scene);
});

test('Three.js orbit contains finite spherical geometry and a closed visitor path', () => {
  const orbit = makeFlightOrbit();
  assert.ok(orbit.globe.children.length > 12);
  assert.ok(orbit.orbitPoint(0).distanceTo(orbit.orbitPoint(Math.PI * 2)) < 1e-10);
  orbit.group.traverse(object => {
    if (!object.geometry) return;
    assert.ok([...object.geometry.attributes.position.array].every(Number.isFinite));
  });
  const scene = new THREE.Scene();
  scene.add(orbit.group);
  scene.add(new THREE.Points(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3(1, 1, 1)]),
    new THREE.PointsMaterial(),
  ));
  let allocated = 0, released = 0;
  scene.traverse(object => {
    if (!object.geometry) return;
    allocated += 2;
    object.geometry.addEventListener('dispose', () => released++);
    object.material.addEventListener('dispose', () => released++);
  });
  disposeScene(scene);
  assert.equal(released, allocated, 'all mesh, line and point geometries and materials must be released');
});

test('render resolution stays within the GPU pixel budget at high device density', () => {
  globalThis.devicePixelRatio = 4;
  for (const [width, height] of [[320, 640], [1920, 1080], [3840, 2160]]) {
    const ratio = pixelRatio(width, height);
    assert.ok(ratio <= 1.5);
    assert.ok(width * height * ratio ** 2 <= 2_000_001);
  }
  delete globalThis.devicePixelRatio;
});

test('flight code measures and settles into the incoming page orbit', () => {
  const source = readFileSync(new URL('../src/scripts/orbital-three.ts', import.meta.url), 'utf8');
  assert.match(source, /const target = document\.querySelector<SVGSVGElement>\('\.orbit-art, \.map-art, \.legal-orbit svg'\)/);
  assert.match(source, /destination = measure\(target\)/);
  assert.match(source, /THREE\.MathUtils\.lerp\(fullRadius, destination\.radius, settle\)/);
  assert.match(source, /function orbitEase\(progress: number\)/);
  assert.match(source, /await animate\(950,/);
  assert.doesNotMatch(source, /reveal:\s*\{\s*value/);
  assert.match(source, /import \{ makeFlightOrbit \} from '\.\/flight-orbit'/);
  assert.doesNotMatch(source, /style\.opacity = '0'/);
});
