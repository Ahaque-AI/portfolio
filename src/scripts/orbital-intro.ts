import * as THREE from 'three';
import { makeFlightOrbit } from './flight-orbit';
import { disposeScene, lightScene, pixelRatio } from './orbital-three';

export function mountIntroOrbit(sceneHost: HTMLElement) {
  const host = sceneHost.querySelector<HTMLElement>('.orbit-three');
  if (!host) return;
  const canvasHost = host;
  let renderer: THREE.WebGLRenderer;
  try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' }); }
  catch { return; }
  const scene = new THREE.Scene();
  lightScene(scene);
  const orbit = makeFlightOrbit();
  scene.add(orbit.group);
  const camera = new THREE.OrthographicCamera(-350, 350, 275, -275, .1, 3000);
  camera.position.z = 1000;
  orbit.marker.visible = false;
  canvasHost.append(renderer.domElement);
  let stopped = false;
  function render() {
    const { width, height } = canvasHost.getBoundingClientRect();
    if (!width || !height || stopped) return;
    renderer.setPixelRatio(pixelRatio(width, height));
    renderer.setSize(width, height);
    camera.left = -width / 2; camera.right = width / 2; camera.top = height / 2; camera.bottom = -height / 2;
    camera.updateProjectionMatrix();
    orbit.group.scale.setScalar(height / 550 * 124);
    orbit.group.position.y = height * 5 / 550;
    renderer.render(scene, camera);
    sceneHost.classList.add('has-three');
  }
  const resize = new ResizeObserver(render);
  resize.observe(canvasHost);
  render();
  document.addEventListener('astro:before-swap', () => {
    stopped = true; resize.disconnect(); disposeScene(scene); renderer.dispose(); renderer.domElement.remove();
  }, { once: true });
}
