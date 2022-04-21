import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
class Control {
  constructor(camera, renderer) {
    this.renderer = renderer;

    this.control = new TrackballControls(camera, renderer.domElement);
    this.control.mouseButtons = { LEFT: 0, MIDDLE: 2, RIGHT: 1 };
    this.control.panSpeed = 1;
    this.control.rotateSpeed = 0.6;
    this.control.zoomSpeed = -1.2;
    this.control.up0.set(0, 0, 1);
    this.control.position0.set(0, -300, 0);
    this.control.reset();
  }

  update() {
    this.control.update();
  }

  async reset() {
    this.control.reset();
  }
}

export default Control;
