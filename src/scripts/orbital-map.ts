import * as THREE from 'three';
import { makeOrbit, lightScene, disposeScene, pixelRatio } from './orbital-three';

export function mountMap(map: HTMLElement) {
  const host = map.querySelector<HTMLElement>('.map-three')!;
  let renderer: THREE.WebGLRenderer;
  try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' }); }
  catch { return; }
  renderer.debug.onShaderError = () => { throw new Error('Map shader could not compile'); };
  const scene = new THREE.Scene();
  lightScene(scene);
  const camera = new THREE.OrthographicCamera(-410, 410, 260, -260, .1, 3000);
  camera.position.z = 1000;
  const orbit = makeOrbit();
  orbit.group.scale.setScalar(93);
  orbit.group.position.x = -16;
  orbit.marker.visible = false;
  scene.add(orbit.group);
  const point = (x: number, y: number) => new THREE.Vector3(x - 410, 260 - y, 120);
  const route = new THREE.CurvePath<THREE.Vector3>();
  route.add(new THREE.CubicBezierCurve3(point(100, 412), point(202, 436), point(257, 337), point(355, 318)));
  route.add(new THREE.CubicBezierCurve3(point(355, 318), point(453, 299), point(527, 301), point(710, 106)));
  const routeMaterial = new THREE.LineBasicMaterial({ color: 0xe7ecac, transparent: true, opacity: .55 });
  const routeLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(route.getPoints(180)), routeMaterial);
  scene.add(routeLine);
  const signal = new THREE.Mesh(new THREE.SphereGeometry(3, 12, 8), new THREE.MeshBasicMaterial({ color: 0xe7ecac }));
  scene.add(signal);
  const signalHalo = new THREE.Mesh(new THREE.RingGeometry(4, 5.5, 24), new THREE.MeshBasicMaterial({ color: 0xe7ecac, transparent: true, opacity: .5, side: THREE.DoubleSide }));
  scene.add(signalHalo);
  const starPositions = Array.from({ length: 120 }, (_, index) => {
    const value = Math.sin((index + 1) * 91.19) * 43758.5453;
    const x = (value - Math.floor(value)) * 790 - 395;
    const y = (Math.sin((index + 1) * 41.83) * 43758.5453 % 1) * 490 - 245;
    return [x, y, -90] as const;
  }).flat();
  const stars = new THREE.Points(
    new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3)),
    new THREE.PointsMaterial({ color: 0xa5b4bb, transparent: true, opacity: .42, size: 2.2, sizeAttenuation: false, depthWrite: false }),
  );
  scene.add(stars);
  host.append(renderer.domElement);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0, visible = false, disposed = false;
  const aim = new THREE.Vector2();
  const drift = new THREE.Vector2();
  function render(now: number) {
    frame = 0;
    if (disposed) return;
    const time = reduced.matches ? 0 : now;
    const phase = time * .00018;
    drift.lerp(aim, .055);
    camera.position.set(drift.x * 12, drift.y * 9, 1000);
    camera.lookAt(drift.x * 3, drift.y * 2, 0);
    orbit.group.rotation.set(Math.sin(phase) * .025, Math.cos(phase * .7) * .04, 0);
    orbit.globe.rotation.y = -.3 + time * .000025;
    orbit.globe.rotation.z = .48 + Math.sin(phase * .6) * .05;
    signal.position.copy(route.getPoint((time % 14000) / 14000));
    signalHalo.position.copy(signal.position);
    const pulse = .8 + (Math.sin(phase * 8) + 1) * .35;
    signalHalo.scale.setScalar(pulse);
    (signalHalo.material as THREE.MeshBasicMaterial).opacity = .22 + (Math.sin(phase * 8) + 1) * .14;
    signal.visible = !reduced.matches;
    signalHalo.visible = !reduced.matches;
    routeMaterial.opacity = .44 + (Math.sin(phase * 2) + 1) * .12;
    stars.rotation.z = phase * .025;
    (stars.material as THREE.PointsMaterial).opacity = .3 + (Math.sin(phase * .8) + 1) * .09;
    try { renderer.render(scene, camera); }
    catch { dispose(); return; }
    if (visible && !document.hidden && !reduced.matches) frame = requestAnimationFrame(render);
  }
  function resume() { cancelAnimationFrame(frame); render(performance.now()); }
  function pointMap(event: PointerEvent) {
    if (reduced.matches || event.pointerType !== 'mouse') return;
    const rect = map.getBoundingClientRect();
    aim.set((event.clientX - rect.left) / rect.width - .5, .5 - (event.clientY - rect.top) / rect.height);
  }
  function resetMap() { aim.set(0, 0); }
  const resize = new ResizeObserver(() => {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setPixelRatio(pixelRatio(width, height));
    renderer.setSize(width, height);
    resume();
  });
  const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; resume(); });
  function dispose() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frame);
    resize.disconnect(); visibility.disconnect();
    reduced.removeEventListener('change', resume);
    map.removeEventListener('pointermove', pointMap);
    map.removeEventListener('pointerleave', resetMap);
    document.removeEventListener('visibilitychange', resume);
    document.removeEventListener('astro:before-swap', dispose);
    renderer.domElement.removeEventListener('webglcontextlost', dispose);
    disposeScene(scene); renderer.dispose(); renderer.domElement.remove();
    map.classList.remove('has-three');
  }
  try {
    const { width, height } = host.getBoundingClientRect();
    renderer.setPixelRatio(pixelRatio(width, height));
    renderer.setSize(width, height);
    render(performance.now());
    if (disposed) return;
    map.classList.add('has-three');
    resize.observe(host); visibility.observe(host);
    reduced.addEventListener('change', resume);
    map.addEventListener('pointermove', pointMap, { passive: true });
    map.addEventListener('pointerleave', resetMap);
    document.addEventListener('visibilitychange', resume);
    document.addEventListener('astro:before-swap', dispose, { once: true });
    renderer.domElement.addEventListener('webglcontextlost', dispose, { once: true });
  } catch { dispose(); }
}
