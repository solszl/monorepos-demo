import * as THREE from "three";
import Abstract3DViewer from "../abstract-3d-viewer";
import Cube from "./cube";
import CubeInteractive from "./cubeInteractive";

class CubeView extends Abstract3DViewer {
  constructor(option) {
    super(option);
  }

  async init() {
    await super.init();
    this.render();
  }

  async render() {
    await super.render();
  }

  _initScene() {
    const scene = new THREE.Scene();
    const { clientWidth: w, clientHeight: h } = this.renderer.domElement;
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1e4);
    camera.position.set(0, 0, w * 2);
    this.camera = camera;
    scene.add(camera);

    this.scene = scene;
    this.camera = camera;
  }

  _initSubClass() {
    super._initSubClass();
    const {
      domElement: { clientWidth },
    } = this.renderer;
    const size = (clientWidth / 1.414) >> 0;
    const cube = new Cube({
      label: ["L", "R", "P", "A", "S", "I"],
      rotateLabel: [-90, 90, 180, 0, 0, 0],
      containerWidth: size,
    });

    this.camera.position.set(0, 0, clientWidth * 2);
    const mesh = cube.getMesh();
    this.scene.add(mesh);
    this.cubeInstance = cube;
    this.renderer.setClearAlpha(0);

    const { useInteractive, control } = this.option;
    if (useInteractive && control) {
      this.interactive = new CubeInteractive(this.renderer, this.camera, mesh);
      this.interactive.control = control;
    }
  }

  updateViewMatrix(mat) {
    const mesh = this.cubeInstance.cubeMesh;
    mesh.quaternion.setFromRotationMatrix(mat);
  }

  // set control(val) {
  //   this._control = val;
  //   this.interactive.control = val;
  // }

  // get control() {
  //   return this._control;
  // }

  rotate(xAngle, yAngle) {
    // super.rotate(xAngle, yAngle);
    const { cubeInstance: cube } = this;
    const mesh = cube.getMesh();
    mesh.rotateX((xAngle * Math.PI) / 180);
    if (yAngle !== 0) {
      mesh.rotateZ((yAngle * Math.PI) / 180);
    }
  }

  reset() {
    const { cubeInstance: cube } = this;
    const mesh = cube.getMesh();
    if (!mesh) {
      return;
    }

    mesh.rotation.set(0, 0, 0);
  }
}

export default CubeView;
