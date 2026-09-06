import * as THREE from 'three';

// Local +Y is the nose direction. The flight controller owns position and heading.
export function makeRocket() {
  const group = new THREE.Group();
  function part(geometry: THREE.BufferGeometry, color: number, y: number) {
    const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color, roughness: .65 }));
    mesh.position.y = y;
    group.add(mesh);
    return mesh;
  }
  part(new THREE.CylinderGeometry(.12, .12, .5, 16), 0xeff0de, 0);
  part(new THREE.ConeGeometry(.12, .24, 16), 0xeff0de, .37);
  part(new THREE.CylinderGeometry(.123, .123, .07, 16), 0xe7ecac, .12);
  part(new THREE.CylinderGeometry(.08, .11, .1, 16), 0x53616a, -.3);
  const engine = new THREE.Mesh(new THREE.SphereGeometry(.065, 12, 8), new THREE.MeshBasicMaterial({ color: 0xe7ecac }));
  engine.position.y = -.38;
  group.add(engine);
  return { group, engine };
}
