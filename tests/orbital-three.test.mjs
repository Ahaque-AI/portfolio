import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const THREE = require('three');
const compiled = ts.transpileModule(readFileSync(new URL('../src/scripts/orbital-three.ts', import.meta.url), 'utf8'), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
}).outputText;
const exports = {};
new Function('require', 'exports', compiled)(require, exports);
const { makeOrbit, disposeScene, pixelRatio } = exports;

test('Three.js orbit contains finite spherical geometry and a closed visitor path', () => {
  const orbit = makeOrbit();
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
  assert.match(source, /const target = document\.querySelector<SVGSVGElement>\('\.orbit-art, \.map-art'\)/);
  assert.match(source, /destination = measure\(target\)/);
  assert.match(source, /THREE\.MathUtils\.lerp\(fullRadius, destination\.radius, settle\)/);
  assert.doesNotMatch(source, /reveal:\s*\{\s*value/);
  assert.doesNotMatch(source, /targetArtwork\.style\.opacity = '0'/);
});
