import * as THREE from 'three';

// Local +Y is the nose direction. The flight controller owns position and heading.
export function makeRocket() {
  const group = new THREE.Group();
  function part(geometry: THREE.BufferGeometry, color: number, y: number, x = 0, z = 0) {
    const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color, roughness: .65 }));
    mesh.position.set(x, y, z);
    group.add(mesh);
    return mesh;
  }
  const hull = part(new THREE.SphereGeometry(.25, 20, 14), 0x53616a, .04, 0, 0);
  hull.scale.set(.9, 1.72, .6);
  const nose = part(new THREE.ConeGeometry(.18, .35, 16), 0xeff0de, .43, 0, 0);
  const cockpit = part(new THREE.SphereGeometry(.14, 16, 12), 0x131f27, .18, 0, .14);
  cockpit.scale.set(.86, 1.3, .45);
  const wing = new THREE.Shape();
  wing.moveTo(0, .17); wing.lineTo(.76, -.18); wing.lineTo(.56, -.46); wing.lineTo(.1, -.29); wing.lineTo(0, -.06); wing.closePath();
  for (const side of [-1, 1]) {
    const mesh = new THREE.Mesh(new THREE.ExtrudeGeometry(wing, { depth: .055, bevelEnabled: false }), new THREE.MeshStandardMaterial({ color: 0xe7ecac, roughness: .58 }));
    mesh.scale.x = side;
    mesh.position.z = -.08;
    group.add(mesh);
  }
  for (const side of [-1, 1]) {
    const fin = part(new THREE.ConeGeometry(.09, .32, 4), 0x29363e, -.18, side * .19, -.1);
    fin.rotation.z = side * .62;
  }
  const engines = [-.29, -.1, .1, .29].map(x => part(new THREE.CylinderGeometry(.06, .085, .26, 12), 0x29363e, -.37, x));
  const thrusters = [-.29, -.1, .1, .29].map(x => {
    const flame = part(new THREE.ConeGeometry(.048, .17, 10), 0xe7ecac, -.59, x);
    flame.rotation.x = Math.PI;
    return flame;
  });
  return { group, hull, nose, cockpit, engines, thrusters };
}
