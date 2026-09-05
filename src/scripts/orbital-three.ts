import * as THREE from 'three';
import { makeFlightOrbit } from './flight-orbit';

export { makeFlightOrbit as makeOrbit };

function orbitEase(progress: number) {
  return progress * progress * progress * (progress * (progress * 6 - 15) + 10);
}

export function lightScene(scene: THREE.Scene) {
  scene.add(new THREE.HemisphereLight(0x9aaeb7, 0x0c151c, 2));
  const key = new THREE.DirectionalLight(0xeff0de, 3);
  key.position.set(-2, 3, 5);
  scene.add(key);
}

export function disposeScene(scene: THREE.Scene) {
  scene.traverse(object => {
    if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points) {
      object.geometry.dispose();
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach(material => material.dispose());
    }
  });
}

export function pixelRatio(width: number, height: number) {
  return Math.min(devicePixelRatio || 1, 1.5, Math.sqrt(2_000_000 / (width * height)));
}

// One GPU canvas persists across Astro's swap. No screenshots or stored page data.
export function createFlight(host: HTMLElement, source: SVGSVGElement) {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.debug.onShaderError = () => { throw new Error('Orbit shader could not compile'); };
  const scene = new THREE.Scene();
  lightScene(scene);
  const orbit = makeFlightOrbit();
  scene.add(orbit.group);
  const camera = new THREE.PerspectiveCamera(35, 1, .1, 100_000);
  const target = new THREE.WebGLRenderTarget(1, 1);
  const uniforms = {
    image: { value: target.texture },
    cover: { value: 0 },
    time: { value: 0 },
    aspect: { value: 1 },
    background: { value: new THREE.Color(0x0c151c) },
  };
  const composite = new THREE.Scene();
  const compositeCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  composite.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({
    uniforms, transparent: true, depthTest: false, depthWrite: false,
    vertexShader: `varying vec2 vUv;
      void main() { vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }`,
    fragmentShader: `
      varying vec2 vUv;
      uniform sampler2D image;
      uniform float cover, time, aspect;
      uniform vec3 background;
      void main() {
        vec2 p = (vUv - .5) * vec2(aspect, 1.);
        vec2 bend = vec2(sin(p.y * 6. + time), cos(p.x * 5. - time)) * .003;
        vec4 c = texture2D(image, clamp(vUv + bend, 0., 1.));
        gl_FragColor = vec4(mix(background, c.rgb, c.a), max(c.a, cover));
        #include <colorspace_fragment>
      }`,
  })));
  host.replaceChildren(renderer.domElement);
  host.classList.add('is-active');
  let width = innerWidth, height = innerHeight;
  const measure = (art: SVGSVGElement) => {
    const core = art.querySelector<SVGCircleElement>('[data-orbit-core]');
    const rect = core?.getBoundingClientRect() ?? art.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, radius: Math.max(12, rect.width / (core ? 2 : 6)) };
  };
  const start = measure(source);
  let destination = start;
  let expansion = 0, landing = 0, stopped = false, frame = 0;
  let settle: (() => void) | undefined;
  function resize() {
    width = innerWidth; height = innerHeight;
    const dpr = pixelRatio(width, height);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height);
    target.setSize(Math.round(width * dpr), Math.round(height * dpr));
    const distance = Math.max(width, height) * 8;
    camera.position.z = distance;
    camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(height / (2 * distance)));
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    uniforms.aspect.value = width / height;
    draw(performance.now());
  }
  function draw(now: number) {
    const ease = orbitEase(expansion);
    const settle = orbitEase(landing);
    const fullRadius = Math.hypot(width, height) * .8;
    const x = landing ? THREE.MathUtils.lerp(width / 2, destination.x, settle) : THREE.MathUtils.lerp(start.x, width / 2, ease);
    const y = landing ? THREE.MathUtils.lerp(height / 2, destination.y, settle) : THREE.MathUtils.lerp(start.y, height / 2, ease);
    orbit.group.position.set(x - width / 2, height / 2 - y, 0);
    orbit.group.scale.setScalar(landing ? THREE.MathUtils.lerp(fullRadius, destination.radius, settle) : THREE.MathUtils.lerp(start.radius, fullRadius, ease));
    orbit.group.rotation.set((1 - settle) * ease * .32, (1 - settle) * ease * -.48, (1 - settle) * ease * .22);
    orbit.marker.position.copy(orbit.orbitPoint(-now * .00048));
    uniforms.cover.value = THREE.MathUtils.smoothstep(expansion, .55, .95);
    uniforms.time.value = now / 1000;
    renderer.setRenderTarget(target);
    renderer.render(scene, camera);
    renderer.setRenderTarget(null);
    renderer.render(composite, compositeCamera);
  }
  function animate(duration: number, update: (progress: number) => void) {
    if (stopped) return Promise.resolve();
    return new Promise<void>(resolve => {
      settle = resolve;
      const startTime = performance.now();
      function tick(now: number) {
        if (stopped) return resolve();
        const progress = Math.min(1, (now - startTime) / duration);
        try { update(progress); draw(now); }
        catch { dispose(); resolve(); return; }
        if (progress < 1) frame = requestAnimationFrame(tick);
        else { settle = undefined; resolve(); }
      }
      frame = requestAnimationFrame(tick);
    });
  }
  function dispose() {
    if (stopped) return;
    stopped = true;
    cancelAnimationFrame(frame);
    settle?.();
    removeEventListener('resize', resize);
    renderer.domElement.removeEventListener('webglcontextlost', dispose);
    disposeScene(scene); disposeScene(composite); target.dispose(); renderer.dispose();
    host.replaceChildren(); host.classList.remove('is-active');
  }
  renderer.domElement.addEventListener('webglcontextlost', dispose, { once: true });
  addEventListener('resize', resize);
  try { resize(); } catch (error) { dispose(); throw error; }
  return {
    cover: () => animate(900, progress => { expansion = progress; }),
    reveal: async () => {
      const target = document.querySelector<SVGSVGElement>('.orbit-art, .map-art');
      if (target) {
        destination = measure(target);
        target.closest<HTMLElement>('.star-map')?.setAttribute('data-flight-landing', '');
      }
      await animate(950, progress => {
        landing = progress;
      });
      target?.closest<HTMLElement>('.star-map')?.removeAttribute('data-flight-landing');
      dispose();
    },
    dispose,
  };
}
