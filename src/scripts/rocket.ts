import * as THREE from 'three';

// Authored exploration fighter.
// Local +Y is the nose direction. The flight controller owns position and heading.
// .update(seconds, reduced) animates thruster flame, engine cores, running lights
// and the canopy pulse so the scene file stays focused on travel and camera.
export function makeRocket() {
  const group = new THREE.Group();
  group.name = 'spaceship';

  // Shared materials so disposal stays cheap and the palette stays consistent.
  const hullMat = new THREE.MeshStandardMaterial({ color: 0x586771, roughness: .42, metalness: .7 });
  const hullDarkMat = new THREE.MeshStandardMaterial({ color: 0x3d4750, roughness: .55, metalness: .62 });
  const accentMat = new THREE.MeshStandardMaterial({ color: 0xeff0de, roughness: .32, metalness: .78 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x1a2228, roughness: .55, metalness: .88 });
  const cockpitMat = new THREE.MeshPhysicalMaterial({
    color: 0x167c9b,
    roughness: .14,
    metalness: .28,
    transmission: .38,
    emissive: 0x167c9b,
    emissiveIntensity: .6,
    ior: 1.5,
    thickness: .08,
  });

  function part(geometry: THREE.BufferGeometry, material: THREE.Material, x = 0, y = 0, z = 0) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    group.add(mesh);
    return mesh;
  }

  // === Hull ===
  // Long, narrow fuselage that carries every other section.
  const hull = part(new THREE.SphereGeometry(.28, 32, 24), hullMat);
  hull.scale.set(.62, 2.5, .4);

  // Lower belly panel, slightly darker, gives the silhouette depth.
  const belly = part(new THREE.SphereGeometry(.23, 24, 16), hullDarkMat);
  belly.scale.set(.55, 1.7, .35);
  belly.position.y = -.08;
  belly.position.z = -.03;

  // Top spine ridge that breaks up the flat dorsal line.
  part(new THREE.BoxGeometry(.04, 1.2, .08), hullDarkMat, 0, .15, .14);
  // Underside cargo bay accent (a panel that catches the engine glow).
  part(new THREE.BoxGeometry(.22, .34, .02), darkMat, 0, -.26, .14);

  // === Nose ===
  const nose = part(new THREE.ConeGeometry(.18, .68, 24), accentMat, 0, .68, 0);
  // Probe spike for sensor detail.
  part(new THREE.ConeGeometry(.025, .16, 6), darkMat, 0, 1.08, 0);
  // Forward sensor ring (small disc near the nose root).
  const sensorRing = part(new THREE.TorusGeometry(.13, .012, 6, 18), darkMat, 0, .34, 0);
  sensorRing.rotation.x = Math.PI / 2;

  // === Cockpit ===
  // The glass canopy.
  const canopy = part(new THREE.SphereGeometry(.17, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), cockpitMat, 0, .27, .14);
  canopy.scale.set(.7, 1.4, .45);
  canopy.rotation.x = -.18;
  // Front canopy frame, half torus arching over the glass.
  const canopyFrame = part(new THREE.TorusGeometry(.17, .012, 8, 24, Math.PI), darkMat, 0, .275, .14);
  canopyFrame.scale.set(.7, 1.4, .45);
  canopyFrame.rotation.x = -Math.PI / 2;
  canopyFrame.rotation.z = Math.PI / 2;
  // Rear canopy support bulkhead.
  part(new THREE.BoxGeometry(.14, .04, .16), darkMat, 0, .24, .14);
  // Pilot helmet silhouette, just visible through the glass.
  const helmet = part(new THREE.SphereGeometry(.07, 12, 10), darkMat, 0, .22, .17);
  helmet.scale.set(.9, 1.1, .8);

  // === Wings (swept delta) ===
  const wingShape = new THREE.Shape();
  wingShape.moveTo(0, .22);
  wingShape.bezierCurveTo(.4, .1, .9, -.05, 1.3, -.3);
  wingShape.lineTo(1.5, -.45);
  wingShape.lineTo(1.2, -.58);
  wingShape.lineTo(.55, -.62);
  wingShape.lineTo(.05, -.38);
  wingShape.closePath();

  for (const side of [-1, 1]) {
    const wing = new THREE.Mesh(
      new THREE.ExtrudeGeometry(wingShape, {
        depth: .05,
        bevelEnabled: true,
        bevelSegments: 1,
        bevelSize: .012,
        bevelThickness: .006,
      }),
      hullMat,
    );
    wing.scale.x = side;
    wing.position.z = -.04;
    group.add(wing);
    // Underside panel for surface variation.
    const wingUnder = new THREE.Mesh(
      new THREE.ExtrudeGeometry(wingShape, { depth: .015, bevelEnabled: false }),
      hullDarkMat,
    );
    wingUnder.scale.x = side;
    wingUnder.scale.z = .5;
    wingUnder.position.set(0, -.08, -.04);
    group.add(wingUnder);
    // Wingtip navigation light: green starboard, red port.
    const wingLightColor = side === 1 ? 0x4ade80 : 0xff3b30;
    part(
      new THREE.SphereGeometry(.05, 12, 8),
      new THREE.MeshBasicMaterial({ color: wingLightColor, transparent: true, opacity: .9, blending: THREE.AdditiveBlending }),
      side * 1.46, -.45, -.02,
    );
    // Wingtip point light so the wing reads at distance.
    const tip = new THREE.PointLight(wingLightColor, .4, 1.6, 1.8);
    tip.position.set(side * 1.5, -.45, -.02);
    group.add(tip);
  }

  // === Engines (twin) ===
  // Lathe points for a nozzle bell that flares slightly at the back.
  const nozzlePoints: THREE.Vector2[] = [];
  for (let i = 0; i <= 10; i++) {
    const t = i / 10;
    const radius = .09 + Math.sin(t * Math.PI * .5) * .035 - t * .015;
    nozzlePoints.push(new THREE.Vector2(radius, t * .13 - .065));
  }

  const engineOffsets = [-.36, .36];
  const engineGlows: THREE.Mesh[] = [];
  const engineCores: THREE.Mesh[] = [];
  const engineFlames: THREE.Mesh[] = [];
  const engineLights: THREE.PointLight[] = [];

  for (const x of engineOffsets) {
    // Engine housing.
    const housing = part(new THREE.CylinderGeometry(.085, .11, .38, 16), darkMat, x, -.4, 0);
    housing.scale.z = .7;
    // Pylon that ties the housing to the hull.
    part(new THREE.BoxGeometry(.08, .18, .12), hullDarkMat, x, -.22, 0);
    // Nozzle bell, lathe gives a clean curve.
    const nozzle = part(new THREE.LatheGeometry(nozzlePoints, 18), darkMat, x, -.6, 0);
    nozzle.scale.z = .7;
    // Glow ring around the nozzle rim.
    const glowRing = part(
      new THREE.TorusGeometry(.08, .012, 8, 18),
      new THREE.MeshBasicMaterial({ color: 0x63e8ff, transparent: true, opacity: .9, blending: THREE.AdditiveBlending }),
      x, -.66, 0,
    );
    glowRing.rotation.x = Math.PI / 2;
    glowRing.scale.z = .7;
    engineGlows.push(glowRing);
    // Bright inner core disc.
    const core = part(
      new THREE.CircleGeometry(.07, 18),
      new THREE.MeshBasicMaterial({ color: 0xa0f0ff, transparent: true, opacity: 1, blending: THREE.AdditiveBlending }),
      x, -.665, 0,
    );
    core.rotation.x = Math.PI / 2;
    core.scale.z = .7;
    engineCores.push(core);
    // Outer exhaust plume.
    const flame = part(
      new THREE.ConeGeometry(.065, .5, 12),
      new THREE.MeshBasicMaterial({ color: 0x63e8ff, transparent: true, opacity: .75, blending: THREE.AdditiveBlending }),
      x, -.94, 0,
    );
    flame.rotation.x = Math.PI;
    flame.scale.z = .7;
    engineFlames.push(flame);
    // Inner brighter flame core, slightly shorter.
    const innerFlame = part(
      new THREE.ConeGeometry(.035, .35, 10),
      new THREE.MeshBasicMaterial({ color: 0xeeffff, transparent: true, opacity: .9, blending: THREE.AdditiveBlending }),
      x, -.88, 0,
    );
    innerFlame.rotation.x = Math.PI;
    innerFlame.scale.z = .7;
    engineFlames.push(innerFlame);
    // Cyan glow light, short range so it warms nearby rocks as the ship passes.
    const light = new THREE.PointLight(0x63e8ff, 1.4, 4.5, 1.8);
    light.position.set(x, -.8, 0);
    group.add(light);
    engineLights.push(light);
  }

  // === Vertical stabilizer (twin fins on the spine) ===
  const finShape = new THREE.Shape();
  finShape.moveTo(0, 0);
  finShape.lineTo(.06, .38);
  finShape.lineTo(-.06, .38);
  finShape.lineTo(-.13, -.04);
  finShape.closePath();
  for (const side of [-1, 1]) {
    const fin = new THREE.Mesh(
      new THREE.ExtrudeGeometry(finShape, { depth: .025, bevelEnabled: false }),
      accentMat,
    );
    fin.scale.x = side;
    fin.position.set(0, -.15, -.12);
    group.add(fin);
  }

  // === Forward twin cannons at the wing roots ===
  for (const side of [-1, 1]) {
    const cannon = part(new THREE.CylinderGeometry(.022, .026, .32, 12), darkMat, side * .28, .14, .04);
    cannon.rotation.x = Math.PI / 2;
    cannon.rotation.z = side * .04;
    // Muzzle ring.
    const muzzle = part(new THREE.TorusGeometry(.026, .005, 6, 12), accentMat, side * .28, .14, .2);
    muzzle.rotation.x = Math.PI / 2;
  }

  // === Underside running lights (citron) ===
  const runningLights: THREE.Mesh[] = [];
  for (let i = 0; i < 5; i++) {
    const t = i / 4;
    const x = (t - .5) * .7;
    const light = part(
      new THREE.SphereGeometry(.028, 8, 6),
      new THREE.MeshBasicMaterial({ color: 0xe7ecac, transparent: true, opacity: .85, blending: THREE.AdditiveBlending }),
      x, -.5, .09,
    );
    runningLights.push(light);
  }

  // Dorsal strobe, blinks at a different rate from the running lights.
  const strobe = part(
    new THREE.SphereGeometry(.04, 10, 8),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .8, blending: THREE.AdditiveBlending }),
    0, .4, .14,
  );

  // === Top antenna/sensor stalk ===
  part(new THREE.CylinderGeometry(.005, .012, .14, 6), darkMat, 0, .44, 0);
  part(new THREE.SphereGeometry(.015, 8, 6), accentMat, 0, .52, 0);

  // === Forward headlight so asteroids light up as the ship approaches ===
  const headlight = new THREE.SpotLight(0xeff0de, 1.6, 9, Math.PI / 6, .35, 1.2);
  headlight.position.set(0, .35, 0);
  const headlightTarget = new THREE.Object3D();
  headlightTarget.position.set(0, 2.2, 0);
  headlight.target = headlightTarget;
  group.add(headlight);
  group.add(headlightTarget);

  // Pulse the engine cores, modulate flame length, blink running lights and strobe.
  function update(seconds: number, reduced = false) {
    const fast = !reduced;
    for (let i = 0; i < engineCores.length; i++) {
      const core = engineCores[i];
      const flame = engineFlames[i * 2];
      const innerFlame = engineFlames[i * 2 + 1];
      const ring = engineGlows[i];
      const light = engineLights[i];
      const t = seconds * 14 + i * 1.3;
      const pulse = fast ? 1 + Math.sin(t) * .18 : 1;
      const flicker = fast ? 1 + Math.sin(t * 2.3 + i * 1.7) * .08 : 1;
      core.scale.setScalar(pulse * flicker);
      ring.scale.setScalar(.95 + (flicker - 1) * 1.4);
      const lengthMod = fast ? 1 + Math.sin(t * .7) * .22 : 1;
      flame.scale.y = lengthMod;
      (flame.material as THREE.MeshBasicMaterial).opacity = .65 + (flicker - 1) * 2;
      innerFlame.scale.y = lengthMod * 1.05;
      (innerFlame.material as THREE.MeshBasicMaterial).opacity = .8 + (flicker - 1) * 1.5;
      light.intensity = fast ? 1.4 + Math.sin(t) * .5 : 1.4;
    }
    runningLights.forEach((light, i) => {
      const phase = seconds * 1.6 + i * .35;
      const blink = reduced ? .85 : (.55 + Math.abs(Math.sin(phase)) * .5);
      (light.material as THREE.MeshBasicMaterial).opacity = blink;
    });
    // Strobe fires a short flash every ~1.2s.
    const strobePhase = seconds % 1.2;
    const strobeOn = strobePhase < .12 ? 1 : 0;
    (strobe.material as THREE.MeshBasicMaterial).opacity = reduced ? .6 : (.15 + strobeOn * .85);
    // Slow canopy pulse so the cockpit reads as alive.
    (canopy.material as THREE.MeshPhysicalMaterial).emissiveIntensity = reduced ? .6 : (.55 + Math.sin(seconds * 1.4) * .12);
  }

  return {
    group,
    hull,
    nose,
    cockpit: canopy,
    canopy,
    engines: engineFlames,
    engineGlows,
    engineCores,
    thrusters: engineFlames,
    runningLights,
    update,
  };
}
