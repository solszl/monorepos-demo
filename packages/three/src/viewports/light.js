import * as THREE from "three";

class Light {
  constructor(parent) {
    // 初始化 灯光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.3);
    const p1 = new THREE.PointLight(0xffffff, 0.4);
    const p2 = new THREE.PointLight(0xffffff, 0.4);

    p1.position.set(-1000, -1000, -1000);
    p2.position.set(1000, 1000, 1000);

    parent.add(ambientLight);
    parent.add(hemiLight);
    parent.add(p1);
    parent.add(p2);
  }
}

export default Light;
