import * as THREE from 'three';

const ink = 0xeff0de;
const accent = 0xe7ecac;

function line(points: THREE.Vector3[], color = ink, opacity = .25) {
  return new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(points),
    new THREE.LineBasicMaterial({ color, transparent: true, opacity }),
  );
}

export function makeOrbit() {
  const group = new THREE.Group();
  const globe = new THREE.Group();
  globe.rotation.set(.2, -.3, .48);
  globe.add(new THREE.Mesh(
    new THREE.SphereGeometry(1, 64, 48),
    new THREE.MeshStandardMaterial({ color: 0x35434b, roughness: .72, metalness: .25 }),
  ));
  for (let longitude = 0; longitude < 12; longitude++) {
    const phi = longitude * Math.PI / 6;
    globe.add(line(Array.from({ length: 97 }, (_, i) => {
      const theta = i / 96 * Math.PI;
      return new THREE.Vector3(Math.sin(theta) * Math.cos(phi), Math.cos(theta), Math.sin(theta) * Math.sin(phi)).multiplyScalar(1.003);
    }), 0xbcc8c5, .22));
  }
  for (let latitude = 1; latitude < 8; latitude++) {
    const theta = latitude * Math.PI / 8;
    globe.add(line(Array.from({ length: 129 }, (_, i) => {
      const phi = i / 128 * Math.PI * 2;
      return new THREE.Vector3(Math.sin(theta) * Math.cos(phi), Math.cos(theta), Math.sin(theta) * Math.sin(phi)).multiplyScalar(1.003);
    }), 0xbcc8c5, .18));
  }
  group.add(globe);
  const orbitPoint = (t: number) => new THREE.Vector3(2.49 * Math.cos(t), 1.065 * Math.sin(t), .7 * Math.sin(t)).applyAxisAngle(new THREE.Vector3(0, 0, 1), .489);
  group.add(line(Array.from({ length: 193 }, (_, i) => orbitPoint(i / 192 * Math.PI * 2)), ink, .48));
  const outer = line(Array.from({ length: 193 }, (_, i) => {
    const t = i / 192 * Math.PI * 2;
    return new THREE.Vector3(2.25 * Math.cos(t), 1.46 * Math.sin(t), -.5 * Math.sin(t)).applyAxisAngle(new THREE.Vector3(0, 0, 1), -.56);
  }), 0xa5b4bb, .23);
  group.add(outer);
  const marker = new THREE.Mesh(new THREE.SphereGeometry(.07, 16, 12), new THREE.MeshBasicMaterial({ color: accent }));
  group.add(marker);
  return { group, globe, marker, orbitPoint };
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
  const orbit = makeOrbit();
  scene.add(orbit.group);
  const camera = new THREE.PerspectiveCamera(35, 1, .1, 100_000);
  const target = new THREE.WebGLRenderTarget(1, 1);
  const uniforms = {
    image: { value: target.texture },
    cover: { value: 0 },
    reveal: { value: 0 },
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
      uniform float cover, reveal, time, aspect;
      uniform vec3 background;
      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float noise(vec2 p) {
        vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
        return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
      }
      void main() {
        vec2 p = (vUv - .5) * vec2(aspect, 1.);
        float flow = noise(p * 4. + time * .12) * .15 + noise(p * 9. - time * .1) * .06;
        float field = length(p) + flow;
        float edge = mix(-.2, length(vec2(aspect, 1.)) * .5 + .4, reveal);
        float veil = smoothstep(edge - .12, edge + .12, field);
        vec2 bend = vec2(sin(p.y * 6. + time), cos(p.x * 5. - time)) * .008 * sin(reveal * 3.14159);
        vec4 c = texture2D(image, clamp(vUv + bend, 0., 1.));
        gl_FragColor = vec4(mix(background, c.rgb, c.a), max(c.a, cover) * veil);
        #include <colorspace_fragment>
      }`,
  })));
  host.replaceChildren(renderer.domElement);
  host.classList.add('is-active');
  const artwork = source.closest<HTMLElement>('.orbit-scene, .star-map') ?? source;
  const previousOpacity = artwork.style.opacity;
  let width = innerWidth, height = innerHeight;
  const core = source.querySelector<SVGCircleElement>('[data-orbit-core]');
  const rect = core?.getBoundingClientRect() ?? source.getBoundingClientRect();
  const start = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, radius: Math.max(12, rect.width / (core ? 2 : 6)) };
  let expansion = 0, stopped = false, frame = 0;
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
    const ease = expansion * expansion * (3 - 2 * expansion);
    orbit.group.position.set((start.x - width / 2) * (1 - ease), (height / 2 - start.y) * (1 - ease), 0);
    orbit.group.scale.setScalar(THREE.MathUtils.lerp(start.radius, Math.hypot(width, height) * .8, ease));
    orbit.group.rotation.set(ease * .32, ease * -.48, ease * .22);
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
    artwork.style.opacity = previousOpacity;
    removeEventListener('resize', resize);
    renderer.domElement.removeEventListener('webglcontextlost', dispose);
    disposeScene(scene); disposeScene(composite); target.dispose(); renderer.dispose();
    host.replaceChildren(); host.classList.remove('is-active');
  }
  renderer.domElement.addEventListener('webglcontextlost', dispose, { once: true });
  addEventListener('resize', resize);
  try { resize(); artwork.style.opacity = '0'; } catch (error) { dispose(); throw error; }
  return {
    cover: () => animate(900, progress => { expansion = progress; }),
    reveal: async () => { await animate(800, progress => { uniforms.reveal.value = progress; }); dispose(); },
    dispose,
  };
}
