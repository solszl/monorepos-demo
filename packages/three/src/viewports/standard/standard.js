import * as THREE from "three";
import { DEFAULT_COLOR, DEFAULT_MATERIAL_CONFIG } from "../constants";
import CubeView from "../cube/cubeView";
import VRInteractive from "../interactive";
import { controlChangeHandler, createTooltip, getCenter } from "../utils";
import Abstract3DViewer from "./../abstract-3d-viewer";
import VRDebugger from "./debugger";
const CORONAL_COLOR_NORMAL = 0xd8b095;
const CORONAL_COLOR_SELECTED = 0x39bcef;
class StandardVRViewport extends Abstract3DViewer {
  constructor(option = {}) {
    super(option);
  }

  async init() {
    await super.init();
    this.render();
  }

  async setUrlObjs(urls) {
    for await (const obj of urls) {
      console.log(obj);
      const { groupName } = obj;
      let currentGroup = null;
      // 判断对应的容器是否存在，如果不存在 创建它。
      const { group } = this;
      currentGroup = group.children.find((group) => {
        return group.userData.groupName === groupName;
      });
      if (!currentGroup) {
        currentGroup = new THREE.Group();
        currentGroup.userData.groupName = groupName;
        group.add(currentGroup);
      }

      // 解构url进行加载
      const { url } = obj;
      const arrayBuffer = await (await fetch(url)).arrayBuffer();

      // 解析arrayBuffer获取geometry
      const { multiLabel } = obj;
      const geometries = await this.parser.parse(arrayBuffer, multiLabel);

      // 构建mesh
      for await (const geometry of geometries) {
        const { type, color } = obj;
        const material = new THREE.MeshPhongMaterial(
          Object.assign(
            {},
            DEFAULT_MATERIAL_CONFIG[type] ?? {},
            color ? { color } : { color: DEFAULT_COLOR[type] } ?? {}
          )
        );
        const mesh = new THREE.Mesh(geometry, material);
        mesh.userData.id = geometry.userData.id;
        currentGroup.add(mesh);
      }

      const { centerGroup } = obj;
      if (centerGroup) {
        const { center, radius } = getCenter(currentGroup);
        const { x, y, z } = center;
        this.group.position.set(-x, -y, -z);
        this.center = center;
      }
    }

    // 如果有交互的话， 设置交互对象
    if (this.interactive) {
      const { children } = this._findGroup("coronary") ?? { children: [] };
      this.interactive.offsetCenter = this.center;
      this.interactive.setCheckObjects(children);
    }
  }

  _initSubClass() {
    super._initSubClass();
    this.group = new THREE.Group();
    this.scene.add(this.group);

    const { cubeEl } = this.option;
    if (cubeEl) {
      const cubeView = new CubeView({
        useInteractive: true,
        el: cubeEl,
        tracer: this.option.tracer,
        core: this.option.core,
        useControl: false,
        useCssRenderer: false,
        useInteractive: true,
        control: this.control,
      });

      if (this.control) {
        this.control.control.addEventListener("change", (e) => {
          const { camera } = this;
          const r = controlChangeHandler(camera) ?? {};
          const { mat, angle, direction } = r;
          if (mat) {
            cubeView.updateViewMatrix(mat);
          }

          if (angle && direction) {
            this.emit("vr_angle_changed", { angle, direction });
          }
        });

        setTimeout(() => {
          this.control.control.dispatchEvent({ type: "change" });
        }, 0);
      }

      this.cube = cubeView;
    }

    if (process.env.NODE_ENV !== "production") {
      new VRDebugger(this.scene);
    }

    const { vernierType = "ring" } = this.option;
    if (!this.ring) {
      let geometry;
      switch (vernierType) {
        case "ring":
          geometry = new THREE.TorusGeometry(5, 0.5, 10, 100);
          break;
        case "circle":
          geometry = new THREE.SphereGeometry(6, 32, 32);
          break;
        default:
          geometry = new THREE.TorusGeometry(5, 0.5, 10, 100);
          break;
      }
      const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
      this.ring = new THREE.Mesh(geometry, material);
      this.ring.visible = true;
      this.ring.userData.id = "ring";
      this.ring.userData.groupName = "ring";
      this.group.add(this.ring);
    }

    // 使用鼠标交互（点击VR血管等操作）
    const { useMouseInteractive = true } = this.option;
    if (useMouseInteractive) {
      const { renderer, camera } = this;
      this.interactive = new VRInteractive(renderer, camera);
      this.interactive.on("internal_vr_click", (point) => {
        this.emit("vr_click", point);
      });
    }
  }

  /**
   * 设置游标位置
   *
   * @param {*} { position, lookAtPosition } 当前位置和观看位置
   * @memberof StandardVRViewport
   */
  vernier({ position, lookAtPosition }) {
    const [x, y, z] = position;
    this.ring.position.set(x, y, z);
    const [lx, ly, lz] = lookAtPosition;
    const { center } = this;
    this.ring.lookAt(lx - center.x, ly - center.y, lz - center.z);
  }

  /**
   * 设置选中状态
   *
   * @param {*} { data, groupName }
   * @return {*}
   * @memberof StandardVRViewport
   */
  setSelected({ data, groupName }) {
    const group = this._findGroup(groupName);
    if (!group) {
      return;
    }
    group.children.forEach((child) => {
      if (data.includes(child.userData.id)) {
        child.material.color.set(CORONAL_COLOR_SELECTED);
      } else {
        child.material.color.set(CORONAL_COLOR_NORMAL);
      }
      child.material.needsUpdate = true;
    });
  }

  /**
   * 设置tooltip
   *
   * @param {*} data
   * @memberof StandardVRViewport
   */
  setTooltip(data) {
    const { tooltipGroup } = this;
    if (!tooltipGroup) {
      this.tooltipGroup = new THREE.Group();
      this.tooltipGroup.userData.groupName = "tooltip";
      this.group.add(this.tooltipGroup);
    }

    this.tooltipGroup.children = [];
    createTooltip(data, this.tooltipGroup);
  }

  /**
   * 设置组的显隐状态
   *
   * @param {*} groupNames
   * @param {*} val
   * @memberof StandardVRViewport
   */
  setGroupVisibility(groupNames, val) {
    const {
      group: { children },
    } = this;
    children.forEach((child) => {
      const {
        userData: { groupName },
      } = child;
      if (groupNames.includes(groupName)) {
        child.visible = val;

        // css2d renderer需要特殊考虑一下
        if (groupName === "tooltip") {
          this.cssRenderer.domElement.style.display = val ? "block" : "none";
        }
      } else {
        child.visible = true;
      }
    });
  }

  _findGroup(groupName) {
    const {
      group: { children },
    } = this;
    return children.find((group) => {
      return group.userData.groupName === groupName;
    });
  }

  destroy() {
    super.destroy();

    if (this.cube) {
      this.cube.destroy();
      this.cube = null;
    }
  }

  static create(option) {
    return new StandardVRViewport(option);
  }
}

export default StandardVRViewport;
