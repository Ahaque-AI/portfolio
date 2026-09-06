import * as THREE from 'three';

// Local +Y is the nose direction. The flight controller owns position and heading.
export function makeRocket() {
  const group = new THREE.Group();
  function part(geometry: THREE.BufferGeometry, color: number, y: number, x = 0, z = 0) {
    const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color, roughness: .48, metalness: .3 }));
    mesh.position.set(x, y, z);
    group.add(mesh);
    return mesh;
  }
  const hull = part(new THREE.SphereGeometry(.3, 24, 16), 0x53616a, .02, 0, 0);
  hull.scale.set(.76, 2.08, .5);
  const nose = part(new THREE.ConeGeometry(.23, .58, 20), 0xeff0de, .57, 0, 0);
  const cockpit = part(new THREE.SphereGeometry(.18, 20, 14), 0x263f50, .2, 0, .17);
  cockpit.scale.set(.72, 1.5, .4);
  (cockpit.material as THREE.MeshStandardMaterial).emissive.setHex(0x167c9b);
  (cockpit.material as THREE.MeshStandardMaterial).emissiveIntensity = .45;
  const wing = new THREE.Shape();
  wing.moveTo(0, .26); wing.lineTo(1.5, -.08); wing.lineTo(1.16, -.32); wing.lineTo(.72, -.62); wing.lineTo(.16, -.38); wing.lineTo(0, -.05); wing.closePath();
  for (const side of [-1, 1]) {
    const mesh = new THREE.Mesh(new THREE.ExtrudeGeometry(wing, { depth: .085, bevelEnabled: false }), new THREE.MeshStandardMaterial({ color: 0xeff0de, roughness: .42, metalness: .35 }));
    mesh.scale.x = side;
    mesh.position.z = -.08;
    group.add(mesh);
    const cannon = part(new THREE.BoxGeometry(.1, .72, .1), 0x29363e, .02, side * 1.08, .04);
    cannon.rotation.z = side * -.14;
  }
  for (const side of [-1, 1]) {
    const fin = part(new THREE.ConeGeometry(.11, .38, 4), 0x29363e, -.18, side * .22, -.1);
    fin.rotation.z = side * .62;
  }
  const engines = [-.72, -.38, .38, .72].map(x => {
    const pod = part(new THREE.CylinderGeometry(.1, .14, .42, 14), 0x29363e, -.5, x);
    pod.scale.z = .8;
    return pod;
  });
  const thrusters = [-.72, -.38, .38, .72].map(x => {
    const flame = part(new THREE.ConeGeometry(.075, .38, 12), 0x63e8ff, -.88, x);
    flame.rotation.x = Math.PI;
    (flame.material as THREE.MeshStandardMaterial).emissive.setHex(0x167c9b);
    (flame.material as THREE.MeshStandardMaterial).emissiveIntensity = 2;
    return flame;
  });
  return { group, hull, nose, cockpit, engines, thrusters };
}
