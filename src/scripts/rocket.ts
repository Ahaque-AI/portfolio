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
  const hull = part(new THREE.SphereGeometry(.24, 20, 14), 0xeff0de, .03, 0, 0);
  hull.scale.set(.9, 1.65, .58);
  const cockpit = part(new THREE.SphereGeometry(.13, 16, 12), 0x35434b, .2, 0, .11);
  cockpit.scale.set(1, 1.35, .45);
  const wing = new THREE.Shape();
  wing.moveTo(0, .11); wing.lineTo(.58, -.22); wing.lineTo(.12, -.35); wing.lineTo(0, -.08); wing.closePath();
  for (const side of [-1, 1]) {
    const mesh = new THREE.Mesh(new THREE.ExtrudeGeometry(wing, { depth: .035, bevelEnabled: false }), new THREE.MeshStandardMaterial({ color: 0xe7ecac, roughness: .58 }));
    mesh.scale.x = side;
    mesh.position.z = -.04;
    group.add(mesh);
  }
  const engines = [-.14, .14].map(x => part(new THREE.CylinderGeometry(.07, .09, .22, 12), 0x53616a, -.32, x));
  const thrusters = [-.14, .14].map(x => part(new THREE.SphereGeometry(.06, 12, 8), 0xe7ecac, -.45, x));
  return { group, hull, cockpit, engines, thrusters };
}
