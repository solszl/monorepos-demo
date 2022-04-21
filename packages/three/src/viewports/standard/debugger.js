import * as THREE from "three";

class VRDebugger {
  constructor(scene) {
    scene.add(new THREE.AxesHelper(1000));

    var geometry = new THREE.BoxGeometry(20, 20, 20);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ffff });
    var cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 0, 0);
    scene.add(cube);
  }
}

export default VRDebugger;
