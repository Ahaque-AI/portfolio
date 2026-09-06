import * as THREE from 'three';
import { makeOrbit, lightScene, disposeScene, pixelRatio } from './orbital-three';
import { makeRocket } from './rocket';

// Scene-only foundation for the guided overlay. No route or dialog ownership.
export function makeSolarSystem() {
  const scene = new THREE.Scene();
  lightScene(scene);
  const sun = makeOrbit();
  sun.marker.visible = false;
  sun.group.scale.setScalar(.72);
  scene.add(sun.group);
  const stops = [
    { id: 'arrival', radius: 2.6, phase: 2.5, size: .16 },
    { id: 'about', radius: 3.7, phase: .6, size: .23 },
    { id: 'work', radius: 4.8, phase: 4.9, size: .19 },
  ].map(({ id, radius, phase, size }) => {
    const point = (angle: number) => new THREE.Vector3(radius * Math.cos(angle), radius * .56 * Math.sin(angle), radius * .18 * Math.sin(angle));
    scene.add(new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(Array.from({ length: 160 }, (_, i) => point(i / 160 * Math.PI * 2))),
      new THREE.LineBasicMaterial({ color: 0xa5b4bb, transparent: true, opacity: .23 }),
    ));
    const group = new THREE.Group();
    const planet = new THREE.Mesh(new THREE.DodecahedronGeometry(size, 1), new THREE.MeshStandardMaterial({ color: id === 'arrival' ? 0xe7ecac : 0xa5b4bb, roughness: .9, flatShading: true }));
    group.add(planet);
    const rocks = Array.from({ length: 12 }, (_, index) => {
      const angle = index * 2.4;
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(.025 + (index % 3) * .012, 0), new THREE.MeshStandardMaterial({ color: 0x53616a, roughness: 1, flatShading: true }));
      rock.position.set(Math.cos(angle) * (.25 + (index % 4) * .05), Math.sin(angle) * (.18 + (index % 3) * .05), (index % 5 - 2) * .03);
      rock.userData.base = rock.position.clone();
      rock.userData.direction = rock.position.clone().normalize();
      group.add(rock);
      return rock;
    });
    group.position.copy(point(phase));
    scene.add(group);
    return { id, group, planet, rocks, point, phase, radius, impact: 0 };
  });
  const fraction = (seed: number) => { const value = Math.sin(seed) * 43758.5453; return value - Math.floor(value); };
  const stars = new THREE.Points(
    new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(
      Array.from({ length: 140 }, (_, i) => [
        (fraction((i + 1) * 91.19) - .5) * 16,
        (fraction((i + 1) * 41.83) - .5) * 12,
        -3 - fraction((i + 1) * 17.7) * 4,
      ]).flat(), 3)),
    new THREE.PointsMaterial({ color: 0xa5b4bb, size: 1.5, sizeAttenuation: false, transparent: true, opacity: .4, depthWrite: false }),
  );
  scene.add(stars);
  const comet = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3(-.55, .15, 0)]),
    new THREE.LineBasicMaterial({ color: 0xe7ecac, transparent: true, opacity: 0 }),
  );
  scene.add(comet);
  const rocket = makeRocket();
  rocket.group.scale.setScalar(.65);
  rocket.group.position.copy(stops[0].group.position).add(new THREE.Vector3(.35, .35, .2));
  rocket.group.rotation.z = -.6;
  scene.add(rocket.group);
  const stream = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(Array(36).fill(0), 3)), new THREE.PointsMaterial({ color: 0xe7ecac, size: 2.5, sizeAttenuation: false, transparent: true, opacity: 0, depthWrite: false }));
  scene.add(stream);
  let struck = 0;
  const approach = new Float32Array(stops.length);
  function arm(index: number) { struck = index + 1; approach[index] = 0; }
  function approachStop(index: number, progress: number) { approach[index] = progress; }
  function strike(index: number) { struck = index + 1; approach[index] = 1; stops[index] && (stops[index].impact = 1); }
  function update(seconds: number, reduced = false) {
    sun.globe.rotation.y = -.3 + seconds * .025;
    for (const stop of stops) {
      stop.group.position.copy(stop.point(stop.phase + seconds * .09 / stop.radius));
      stop.impact = Math.max(0, stop.impact - .012);
      stop.rocks.forEach(rock => {
        const incoming = approach[stops.indexOf(stop)];
        rock.position.copy(rock.userData.base).multiplyScalar(1 - incoming * .72).addScaledVector(rock.userData.direction, stop.impact * .24);
        rock.scale.setScalar(1 + incoming * 4);
      });
    }
    const target = stops[struck - 1];
    rocket.thrusters.forEach((thruster, index) => {
      const pulse = reduced ? 1 : 1 + Math.sin(seconds * 13 + index) * .14;
      thruster.scale.set(pulse, 1 + (pulse - 1) * 2, pulse);
    });
    const positions = stream.geometry.attributes.position.array as Float32Array;
    if (target && !reduced) {
      for (let index = 0; index < 12; index++) {
        const point = target.group.position.clone().lerp(rocket.group.position, ((seconds * .9 + index / 12) % 1));
        positions.set(point.toArray(), index * 3);
      }
      stream.geometry.attributes.position.needsUpdate = true;
      (stream.material as THREE.PointsMaterial).opacity = .58;
    } else (stream.material as THREE.PointsMaterial).opacity = 0;
    const pass = seconds % 24;
    comet.visible = !reduced && pass > 18 && pass < 20;
    comet.position.set(-6 + (pass - 18) * 6, 3 - (pass - 18) * 1.5, -1);
    comet.material.opacity = comet.visible ? Math.sin((pass - 18) / 2 * Math.PI) * .5 : 0;
  }
  update(0);
  return { scene, sun, stops, rocket, stars, comet, stream, arm, approachStop, strike, update };
}

// The caller dynamically imports this module on intent and supplies an empty host.
// Undefined means WebGL failed: the caller keeps its HTML fallback visible.
export function mountSolarSystem(host: HTMLElement, onFailure: () => void = () => {}) {
  let renderer: THREE.WebGLRenderer;
  try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' }); }
  catch { return; }
  const system = makeSolarSystem();
  system.rocket.group.scale.setScalar(2.1);
  const camera = new THREE.PerspectiveCamera(40, 1, .1, 100);
  const aim = new THREE.Vector2(), drift = new THREE.Vector2();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'display:block;width:100%;height:100%;pointer-events:none';
  host.append(canvas);
  let frame = 0, last = 0, clock = 0, distance = 10;
  let visible = false, sized = false, disposed = false;
  let travel = 1, targetIndex = 0, hit = true;
  let path = makeFlightPath(system.rocket.group.position, system.rocket.group.position);
  const heading = new THREE.Vector3(0, 1, 0);
  const look = new THREE.Vector3();
  function flyTo(index: number) {
    const stop = system.stops[index];
    if (!stop || disposed) return;
    const end = stop.group.position.clone().add(new THREE.Vector3(.35, .35, .2));
    path = makeFlightPath(system.rocket.group.position, end);
    travel = reduced.matches ? 1 : 0;
    targetIndex = index;
    hit = reduced.matches;
    system.arm(index);
    if (reduced.matches) system.strike(index);
    resume();
  }
  function render(now: number) {
    frame = 0;
    if (disposed || !sized) return;
    const delta = last ? Math.min(now - last, 50) : 0;
    last = now;
    if (!reduced.matches) {
      clock += delta / 1000;
      drift.lerp(aim, 1 - Math.exp(-delta / 295));
    }
    // Hold planet locations so captions and rocket land on the same stops.
    system.update(clock, reduced.matches);
    for (const stop of system.stops) stop.group.position.copy(stop.point(stop.phase));
    if (reduced.matches) travel = 1;
    else travel = Math.min(1, travel + delta / 1800);
    const eased = travel * travel * (3 - 2 * travel);
    system.approachStop(targetIndex, eased);
    if (!hit && travel === 1) { system.strike(targetIndex); hit = true; }
    system.rocket.group.position.copy(path.getPointAt(eased));
    if (travel < 1) system.rocket.group.quaternion.setFromUnitVectors(heading, path.getTangentAt(eased));
    look.copy(system.rocket.group.position);
    camera.position.set(look.x + drift.x * .4, look.y + drift.y * .3, distance);
    camera.lookAt(look);
    try { renderer.render(system.scene, camera); }
    catch { dispose(); onFailure(); return; }
    if (visible && !document.hidden && !reduced.matches) frame = requestAnimationFrame(render);
  }
  function resume() {
    cancelAnimationFrame(frame);
    last = 0;
    if (visible && !document.hidden) render(performance.now());
  }
  function resizeScene() {
    const { width, height } = host.getBoundingClientRect();
    sized = width > 0 && height > 0;
    if (!sized) { cancelAnimationFrame(frame); last = 0; return; }
    renderer.setPixelRatio(pixelRatio(width, height));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    distance = Math.max(8, 3 / camera.aspect) / Math.tan(THREE.MathUtils.degToRad(20));
    camera.updateProjectionMatrix();
    resume();
  }
  function point(event: PointerEvent) {
    if (reduced.matches || event.pointerType !== 'mouse') return;
    const rect = host.getBoundingClientRect();
    if (rect.width && rect.height) aim.set((event.clientX - rect.left) / rect.width - .5, .5 - (event.clientY - rect.top) / rect.height);
  }
  function reset() { aim.set(0, 0); }
  function contextLost() { dispose(); onFailure(); }
  const resize = new ResizeObserver(resizeScene);
  const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; resume(); });
  function dispose() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frame);
    resize.disconnect(); visibility.disconnect();
    reduced.removeEventListener('change', resume);
    document.removeEventListener('visibilitychange', resume);
    document.removeEventListener('astro:before-swap', dispose);
    host.removeEventListener('pointermove', point);
    host.removeEventListener('pointerleave', reset);
    canvas.removeEventListener('webglcontextlost', contextLost);
    disposeScene(system.scene); renderer.dispose(); canvas.remove();
  }
  renderer.debug.onShaderError = () => { throw new Error('Solar system shader could not compile'); };
  try {
    visible = true;
    resizeScene();
    if (disposed) return;
    resize.observe(host); visibility.observe(host);
    reduced.addEventListener('change', resume);
    document.addEventListener('visibilitychange', resume);
    document.addEventListener('astro:before-swap', dispose, { once: true });
    host.addEventListener('pointermove', point, { passive: true });
    host.addEventListener('pointerleave', reset);
    canvas.addEventListener('webglcontextlost', contextLost, { once: true });
  } catch { dispose(); return; }
  return { ...system, camera, flyTo, dispose };
}

export function makeFlightPath(start: THREE.Vector3, end: THREE.Vector3) {
  const middle = start.clone().lerp(end, .5);
  middle.z += 1.4;
  return new THREE.CatmullRomCurve3([start.clone(), middle, end.clone()]);
}
