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
  const hull = part(new THREE.SphereGeometry(.28, 24, 16), 0x53616a, .02, 0, 0);
  hull.scale.set(.82, 1.92, .5);
  const nose = part(new THREE.ConeGeometry(.2, .46, 20), 0xeff0de, .5, 0, 0);
  const cockpit = part(new THREE.SphereGeometry(.16, 20, 14), 0x0c151c, .19, 0, .16);
  cockpit.scale.set(.78, 1.42, .38);
  const wing = new THREE.Shape();
  wing.moveTo(0, .25); wing.lineTo(1.12, -.16); wing.lineTo(.82, -.58); wing.lineTo(.18, -.34); wing.lineTo(0, -.05); wing.closePath();
  for (const side of [-1, 1]) {
    const mesh = new THREE.Mesh(new THREE.ExtrudeGeometry(wing, { depth: .075, bevelEnabled: false }), new THREE.MeshStandardMaterial({ color: 0xeff0de, roughness: .42, metalness: .35 }));
    mesh.scale.x = side;
    mesh.position.z = -.08;
    group.add(mesh);
    const cannon = part(new THREE.BoxGeometry(.09, .62, .09), 0x29363e, .02, side * .96, .04);
    cannon.rotation.z = side * -.14;
  }
  for (const side of [-1, 1]) {
    const fin = part(new THREE.ConeGeometry(.11, .38, 4), 0x29363e, -.18, side * .22, -.1);
    fin.rotation.z = side * .62;
  }
  const engines = [-.42, -.14, .14, .42].map(x => part(new THREE.CylinderGeometry(.075, .1, .3, 12), 0x29363e, -.42, x));
  const thrusters = [-.42, -.14, .14, .42].map(x => {
    const flame = part(new THREE.ConeGeometry(.058, .28, 10), 0x63e8ff, -.7, x);
    flame.rotation.x = Math.PI;
    (flame.material as THREE.MeshStandardMaterial).emissive.setHex(0x167c9b);
    (flame.material as THREE.MeshStandardMaterial).emissiveIntensity = 2;
    return flame;
  });
  return { group, hull, nose, cockpit, engines, thrusters };
}
