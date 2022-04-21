import { Component } from "@pkg/core/src";
import * as THREE from "three";
/**
 * 冠脉交互
 *
 * @class CtaInteractive
 */
class VRInteractive extends Component {
  constructor(renderer, camera, intersectObjects = null, autoMount = true) {
    super({});
    this.renderer = renderer;
    this.camera = camera;
    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();

    this.objects = intersectObjects;

    this.mouseMoved = false;
    this.enabled = false;
    if (autoMount) {
      this.activate();
    }
  }

  activate() {
    this.enabled = true;
    const { domElement } = this.renderer;

    domElement.addEventListener("mouseenter", this._mouseEnterHandler.bind(this));
    domElement.addEventListener("mouseleave", this._mouseLeaveHandler.bind(this));

    domElement.addEventListener("click", this._clickHandler.bind(this));
  }

  deactivate() {
    this.enabled = false;
    this.mouseMoved = false;
    const { domElement } = this.renderer;
    domElement.removeEventListener("mouseenter", this._mouseEnterHandler);
    domElement.addEventListener("mouseleave", this._mouseLeaveHandler.bind(this));
  }

  _mouseLeaveHandler(e) {
    this.mouseMoved = false;
    const { domElement } = this.renderer;
    domElement.addEventListener("mouseenter", this._mouseEnterHandler.bind(this));
  }

  _mouseEnterHandler(e) {
    const { domElement } = this.renderer;
    domElement.removeEventListener("mouseenter", this._mouseEnterHandler);
  }

  async _clickHandler(e) {
    e.preventDefault();
    if (this.enabled === false) {
      return;
    }
    const { domElement } = this.renderer;
    const { mouse } = this;
    mouse.x = (e.offsetX / domElement.clientWidth) * 2 - 1;
    mouse.y = -(e.offsetY / domElement.clientHeight) * 2 + 1;
    const { raycaster, camera, objects } = this;
    raycaster.setFromCamera(mouse, camera);

    const items = raycaster.intersectObjects(objects);
    if (items && items.length > 0) {
      const { offsetCenter } = this;
      const { object, point } = items[0];
      const data = point.add(offsetCenter);
      this.emit("internal_vr_click", {
        point: data.toArray(),
        id: object.userData.id,
      });
    }
  }

  setCheckObjects(arr) {
    this.objects = arr;
  }
}

export default VRInteractive;
