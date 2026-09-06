import * as THREE from 'three';
import { lightScene, disposeScene, pixelRatio } from './orbital-three';
import { makeRocket } from './rocket';

// Scene-only foundation for the guided overlay. No route or dialog ownership.
export function makeSolarSystem() {
  const scene = new THREE.Scene();
  lightScene(scene);
  const stops = [
    { id: 'arrival', radius: 2.6, phase: 2.5, size: 4.5, color: 0xa24834, base: new THREE.Vector3(-5, 4, -30) },
    { id: 'therapy', radius: 3.7, phase: .6, size: 5.6, color: 0x24665e, base: new THREE.Vector3(8, -2, -58) },
    { id: 'research', radius: 4.8, phase: 4.9, size: 5.1, color: 0x554481, base: new THREE.Vector3(-9, 5, -88) },
    { id: 'systems', radius: 5.9, phase: 1.8, size: 6.2, color: 0x235f91, base: new THREE.Vector3(6, 1, -120) },
  ].map(({ id, radius, phase, size, color, base }) => {
    const point = (angle: number) => base.clone().add(new THREE.Vector3(Math.cos(angle) * .35, Math.sin(angle) * .22, Math.sin(angle) * .08));
    const group = new THREE.Group();
    const planet = new THREE.Mesh(new THREE.SphereGeometry(size, 32, 20), new THREE.MeshStandardMaterial({ color, roughness: .95, flatShading: true, emissive: color, emissiveIntensity: .08 }));
    group.add(planet);
    const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(size * 1.08, 32, 20), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: .16, blending: THREE.AdditiveBlending, side: THREE.BackSide, depthWrite: false }));
    group.add(atmosphere);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(size * 1.18, Math.max(.035, size * .018), 8, 64), new THREE.MeshBasicMaterial({ color: 0xffc77d, transparent: true, opacity: .22 }));
    ring.rotation.x = Math.PI * .38;
    group.add(ring);
    const rocks = Array.from({ length: 12 }, (_, index) => {
      const angle = index * 2.4;
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(.22 + (index % 3) * .11, 1), new THREE.MeshStandardMaterial({ color: 0x53616a, roughness: 1, flatShading: true }));
      rock.position.set(Math.cos(angle) * (2.2 + (index % 4) * .65), Math.sin(angle) * (1.7 + (index % 3) * .5), 1.2 + (index % 5) * .5);
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
  rocket.group.scale.setScalar(1.85);
  rocket.group.position.set(0, -3.2, 3.6);
  scene.add(rocket.group);
  const stream = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(Array(36).fill(0), 3)), new THREE.PointsMaterial({ color: 0xe7ecac, size: 2.5, sizeAttenuation: false, transparent: true, opacity: 0, depthWrite: false }));
  scene.add(stream);
  let struck = 0;
  const approach = new Float32Array(stops.length);
  function arm(index: number) { struck = index + 1; approach[index] = 0; }
  function approachStop(index: number, progress: number) { approach[index] = progress; }
  function strike(index: number) { struck = index + 1; approach[index] = 1; stops[index] && (stops[index].impact = 1); }
  function update(seconds: number, reduced = false) {
    for (const stop of stops) {
      stop.group.position.copy(stop.point(stop.phase));
      stop.planet.rotation.y = seconds * .025 / stop.radius;
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
        const point = rocket.group.position.clone().lerp(target.group.position, ((seconds * 2 + index / 12) % 1));
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
  return { scene, stops, rocket, stars, comet, stream, arm, approachStop, strike, update };
}

// The caller dynamically imports this module on intent and supplies an empty host.
// Undefined means WebGL failed: the caller keeps its HTML fallback visible.
export function mountSolarSystem(host: HTMLElement, onFailure: () => void = () => {}) {
  let renderer: THREE.WebGLRenderer;
  try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' }); }
  catch { return; }
  const system = makeSolarSystem();
  system.rocket.group.scale.setScalar(3.4);
  const camera = new THREE.PerspectiveCamera(40, 1, .1, 360);
  const aim = new THREE.Vector2(), drift = new THREE.Vector2();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'display:block;width:100%;height:100%;pointer-events:none';
  host.append(canvas);
  let frame = 0, last = 0, clock = 0, distance = 11;
  let visible = false, sized = false, disposed = false;
  let travel = 1, targetIndex = 0, activeIndex = 0, travelDuration = 2400, hit = true;
  let path = makeFlightPath(system.rocket.group.position, system.rocket.group.position);
  const heading = new THREE.Vector3(0, 1, 0);
  const tangent = new THREE.Vector3();
  const look = new THREE.Vector3();
  const smoothCamera = new THREE.Vector3();
  const smoothLook = new THREE.Vector3();
  let cameraReady = false;
  function flyTo(index: number) {
    const stop = system.stops[index];
    if (!stop || disposed) return;
    system.stops.forEach((candidate, candidateIndex) => { candidate.group.visible = candidateIndex === index || candidateIndex === activeIndex; });
    path = makeFlightPath(system.rocket.group.position, stop.group.position.clone().add(new THREE.Vector3(0, -2.2, 7)));
    travelDuration = THREE.MathUtils.clamp(path.getLength() * 58, 1800, 4200);
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
    // Objectives stay fixed in space while the ship and camera travel between them.
    system.update(clock, reduced.matches);
    for (const stop of system.stops) stop.group.position.copy(stop.point(stop.phase));
    if (reduced.matches) travel = 1;
    else travel = Math.min(1, travel + delta / travelDuration);
    const eased = travel * travel * travel * (travel * (travel * 6 - 15) + 10);
    system.approachStop(targetIndex, eased);
    if (!hit && travel === 1) {
      system.strike(targetIndex);
      system.stops.forEach((stop, index) => { stop.group.visible = index === targetIndex; });
      activeIndex = targetIndex;
      hit = true;
    }
    system.rocket.group.position.copy(path.getPointAt(eased));
    tangent.copy(path.getTangentAt(Math.min(.999, eased))).normalize();
    system.rocket.group.quaternion.setFromUnitVectors(heading, tangent);
    look.copy(system.stops[targetIndex].group.position).add(new THREE.Vector3(drift.x * .45, drift.y * .3, 0));
    const desiredCamera = system.rocket.group.position.clone().add(new THREE.Vector3(drift.x * .25, 2.8 + drift.y * .15, distance));
    if (!cameraReady) { smoothCamera.copy(desiredCamera); smoothLook.copy(look); cameraReady = true; }
    const settle = 1 - Math.exp(-delta / 150);
    smoothCamera.lerp(desiredCamera, settle);
    smoothLook.lerp(look, 1 - Math.exp(-delta / 190));
    camera.position.copy(smoothCamera);
    camera.lookAt(smoothLook);
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
    distance = Math.max(10, 3.5 / camera.aspect) / Math.tan(THREE.MathUtils.degToRad(20));
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
  middle.z += 10;
  middle.y += 4;
  middle.x += end.x >= start.x ? -7 : 7;
  return new THREE.CatmullRomCurve3([start.clone(), middle, end.clone()]);
}
