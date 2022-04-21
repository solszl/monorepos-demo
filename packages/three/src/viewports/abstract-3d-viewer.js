// import { AbstractViewport } from "@pkg/viewer/src/xx";
import * as THREE from "three";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";
import AbstractViewport from "../../../viewer/src/viewports/abstract-viewport";
import Control from "./control";
import Light from "./light";
import Parser from "./parser";

class Abstract3DViewer extends AbstractViewport {
  constructor(option = {}) {
    super(option);
    const { core } = option;
    /** @type { RenderSchedule } from core instance.*/
    this.renderSchedule = core.renderSchedule;
    this.init();
  }

  init() {
    super.init();

    this.parser = new Parser();
    this._initRenderer();

    this._initScene();

    this._initSubClass();
  }

  async render() {
    await super.render();

    if (!this.renderer) {
      return;
    }

    const { scene, camera } = this;
    this.renderer.render(scene, camera);
    if (this.cssRenderer) {
      this.cssRenderer.render(scene, camera);
    }

    if (this.control) {
      this.control.update();
    }

    this.renderSchedule.invalidate(this.render, this);
    return true;
  }

  resize(width, height) {
    super.resize(width, height);

    if (this.camera) {
      this.camera.left = width / -2;
      this.camera.right = width / 2;
      this.camera.top = height / 2;
      this.camera.bottom = height / -2;
      this.camera.updateProjectionMatrix();
    }

    this.renderer.setSize(width, height);
  }

  setVisibility(groups, visibility) {
    const {
      group: { children },
    } = this;

    children.forEach((group) => {
      const {
        userData: { groupName },
      } = group;
      if (groups.includes(groupName)) {
        group.visible = visibility;
      } else {
        group.visible = true;
      }
    });
  }

  setTooltips(tooltip) {}

  reset() {
    if (this.control) {
      this.control.reset();
    }
  }

  destroy() {
    super.destroy();
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }

    if (this.cssRenderer) {
      this.cssRenderer.domElement.innerHTML = "";
      this.cssRenderer = null;
    }

    this.camera = null;

    if (this.control) {
      this.control.control.dispose();
      this.control = null;
    }

    if (this.scene) {
      this.scene.clear();
      this.scene = null;
    }
  }

  _initRenderer() {
    const { el, backgroundColor = 0x000000 } = this.option;

    // webgl 渲染器
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });

    const style = window.getComputedStyle(el);
    renderer.setSize(parseInt(style.width), parseInt(style.height));
    renderer.setClearColor(backgroundColor, 1);
    el.appendChild(renderer.domElement);
    this.renderer = renderer;

    const { useCssRenderer = true } = this.option;
    if (!useCssRenderer) {
      return;
    }

    // css渲染器
    const cssRenderer = new CSS2DRenderer();
    cssRenderer.setSize(parseInt(style.width), parseInt(style.height));
    cssRenderer.domElement.style.position = "absolute";
    cssRenderer.domElement.style.top = "0px";
    cssRenderer.domElement.style.pointerEvents = "none";

    el.appendChild(cssRenderer.domElement);
    this.cssRenderer = cssRenderer;
  }

  _initScene() {
    const scene = new THREE.Scene();
    const { clientWidth: w, clientHeight: h } = this.renderer.domElement;
    const camera = new THREE.OrthographicCamera(w / -2, w / 2, h / 2, h / -2, 1, 1000);
    camera.position.set(0, 0, -300);
    camera.lookAt(0, 0, 0);
    scene.add(camera);

    new Light(camera);
    const { useControl = true } = this.option;
    if (useControl) {
      this.control = new Control(camera, this.renderer);
    }
    this.scene = scene;
    this.camera = camera;
  }

  _initSubClass() {
    // implements by subclass.
  }
}

export default Abstract3DViewer;
