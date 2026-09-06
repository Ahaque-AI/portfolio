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
    const planet = new THREE.Mesh(new THREE.SphereGeometry(size, 24, 16), new THREE.MeshStandardMaterial({ color: id === 'arrival' ? 0xe7ecac : 0xa5b4bb, roughness: .8 }));
    planet.position.copy(point(phase));
    scene.add(planet);
    return { id, planet, point, phase, radius };
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
  rocket.group.position.copy(stops[0].planet.position).add(new THREE.Vector3(.35, .35, .2));
  rocket.group.rotation.z = -.6;
  scene.add(rocket.group);
  function update(seconds: number, reduced = false) {
    sun.globe.rotation.y = -.3 + seconds * .025;
    for (const stop of stops) stop.planet.position.copy(stop.point(stop.phase + seconds * .09 / stop.radius));
    const pass = seconds % 24;
    comet.visible = !reduced && pass > 18 && pass < 20;
    comet.position.set(-6 + (pass - 18) * 6, 3 - (pass - 18) * 1.5, -1);
    comet.material.opacity = comet.visible ? Math.sin((pass - 18) / 2 * Math.PI) * .5 : 0;
  }
  update(0);
  return { scene, sun, stops, rocket, stars, comet, update };
}

// The caller dynamically imports this module on intent and supplies an empty host.
// Undefined means WebGL failed: the caller keeps its HTML fallback visible.
export function mountSolarSystem(host: HTMLElement) {
  let renderer: THREE.WebGLRenderer;
  try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' }); }
  catch { return; }
  const system = makeSolarSystem();
  const camera = new THREE.PerspectiveCamera(40, 1, .1, 100);
  const aim = new THREE.Vector2(), drift = new THREE.Vector2();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'display:block;width:100%;height:100%;pointer-events:none';
  host.append(canvas);
  let frame = 0, last = 0, clock = 0, distance = 16;
  let visible = false, sized = false, disposed = false;
  function render(now: number) {
    frame = 0;
    if (disposed || !sized) return;
    const delta = last ? Math.min(now - last, 50) : 0;
    last = now;
    if (!reduced.matches) {
      clock += delta / 1000;
      drift.lerp(aim, 1 - Math.exp(-delta / 295));
    }
    system.update(clock, reduced.matches);
    camera.position.set(drift.x * .4, drift.y * .3, distance);
    camera.lookAt(0, 0, 0);
    try { renderer.render(system.scene, camera); }
    catch { dispose(); return; }
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
    distance = Math.max(10, 5.8 / camera.aspect) / Math.tan(THREE.MathUtils.degToRad(20));
    camera.updateProjectionMatrix();
    resume();
  }
  function point(event: PointerEvent) {
    if (reduced.matches || event.pointerType !== 'mouse') return;
    const rect = host.getBoundingClientRect();
    if (rect.width && rect.height) aim.set((event.clientX - rect.left) / rect.width - .5, .5 - (event.clientY - rect.top) / rect.height);
  }
  function reset() { aim.set(0, 0); }
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
    canvas.removeEventListener('webglcontextlost', dispose);
    disposeScene(system.scene); renderer.dispose(); canvas.remove();
  }
  renderer.debug.onShaderError = () => { throw new Error('Solar system shader could not compile'); };
  try {
    resizeScene(); resize.observe(host); visibility.observe(host);
    reduced.addEventListener('change', resume);
    document.addEventListener('visibilitychange', resume);
    document.addEventListener('astro:before-swap', dispose, { once: true });
    host.addEventListener('pointermove', point, { passive: true });
    host.addEventListener('pointerleave', reset);
    canvas.addEventListener('webglcontextlost', dispose, { once: true });
  } catch { dispose(); return; }
  return { ...system, camera, dispose };
}
