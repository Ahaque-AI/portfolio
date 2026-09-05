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
  const routeLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(route.getPoints(180)), new THREE.LineBasicMaterial({ color: 0xe7ecac, transparent: true, opacity: .55 }));
  scene.add(routeLine);
  const signal = new THREE.Mesh(new THREE.SphereGeometry(3, 12, 8), new THREE.MeshBasicMaterial({ color: 0xe7ecac }));
  scene.add(signal);
  host.append(renderer.domElement);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0, visible = false, disposed = false;
  function render(now: number) {
    frame = 0;
    if (disposed) return;
    const time = reduced.matches ? 0 : now;
    orbit.globe.rotation.y = -.3 + time * .000025;
    signal.position.copy(route.getPoint((time % 14000) / 14000));
    signal.visible = !reduced.matches;
    try { renderer.render(scene, camera); }
    catch { dispose(); return; }
    if (visible && !document.hidden && !reduced.matches) frame = requestAnimationFrame(render);
  }
  function resume() { cancelAnimationFrame(frame); render(performance.now()); }
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
    document.addEventListener('visibilitychange', resume);
    document.addEventListener('astro:before-swap', dispose, { once: true });
    renderer.domElement.addEventListener('webglcontextlost', dispose, { once: true });
  } catch { dispose(); }
}
