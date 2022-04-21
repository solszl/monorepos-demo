import * as THREE from 'three';

const FACE_INDEX = {
  up: {
    0: [0, 0, 1],
    1: [0, 0, 1],
    2: [0, 0, 1],
    3: [0, 0, 1],
    4: [0, 1, 0],
    5: [0, -1, 0],
  },
  position: {
    0: [600, 0, 0],
    1: [-600, 0, 0],
    2: [0, 600, 0],
    3: [0, -600, 0],
    4: [0, 0, 600],
    5: [0, 0, -600],
  },
};
class CubeInteractive {
  constructor(renderer, camera, hitTestObj) {
    this.camera = camera;
    this.renderer = renderer;

    this.mouse = new THREE.Vector2();
    this.clicked = false;
    const { domElement } = renderer;
    this.raycaster = new THREE.Raycaster();
    this.hitTestObj = hitTestObj;
    domElement.addEventListener('click', this._clickHandler.bind(this));
    this.control = null;
  }

  async _clickHandler(e) {
    e.preventDefault();
    this.clicked = true;

    const { domElement } = this.renderer;
    const { mouse } = this;
    mouse.x = (e.offsetX / domElement.clientWidth) * 2 - 1;
    mouse.y = -(e.offsetY / domElement.clientHeight) * 2 + 1;

    const { raycaster, camera, hitTestObj } = this;
    raycaster.setFromCamera(mouse, camera);
    const items = raycaster.intersectObject(hitTestObj);
    const { length } = items;

    if (length) {
      const item = items[0];
      const index = item.faceIndex >> 1;

      // l:0, r:1, p:2, a:3, s:4, i:5
      const { control } = this.control;
      if (control) {
        const { object: camera } = control;
        const { up, position } = FACE_INDEX;
        camera.up.set(...up[index]);
        camera.position.set(...position[index]);
        await this.delay(50);
        this.control.control.dispatchEvent({ type: 'change' });
      }
    }
  }

  async delay(ms, value) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms, value);
    });
  }
}

export default CubeInteractive;
