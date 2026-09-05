import * as THREE from 'three';

const ink = 0xeff0de;
const accent = 0xe7ecac;

function line(points: THREE.Vector3[], color = ink, opacity = .25) {
  return new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color, transparent: true, opacity }));
}

// Flight-only geometry. Page SVG labels and visitor markers are never part of this scene.
export function makeFlightOrbit() {
  const group = new THREE.Group();
  const globe = new THREE.Group();
  globe.rotation.set(.2, -.3, .48);
  globe.add(new THREE.Mesh(new THREE.SphereGeometry(1, 64, 48), new THREE.MeshStandardMaterial({ color: 0x35434b, roughness: .72, metalness: .25 })));
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
  group.add(line(Array.from({ length: 193 }, (_, i) => {
    const t = i / 192 * Math.PI * 2;
    return new THREE.Vector3(2.25 * Math.cos(t), 1.46 * Math.sin(t), -.5 * Math.sin(t)).applyAxisAngle(new THREE.Vector3(0, 0, 1), -.56);
  }), 0xa5b4bb, .23));
  const marker = new THREE.Mesh(new THREE.SphereGeometry(.07, 16, 12), new THREE.MeshBasicMaterial({ color: accent }));
  group.add(marker);
  return { group, globe, marker, orbitPoint };
}
