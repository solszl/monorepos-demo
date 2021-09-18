import { Core } from "@pkg/core/src";
import LinkageManager from "./linkage-manager";
import Viewport from "./view-bridge";
class ViewportManager {
  constructor() {
    this.viewports = new Map();
    // TODO: 理论上会有动态调整参数的概念，但是还未实现
    this.core = new Core({ fps: 30 });
    this.linkManager = new LinkageManager(this.viewports);
    window.__TX_VIEWPORT_MANAGER__ = this;
  }

  addViewport(option) {
    // 将核心选调度器传入
    Object.assign(option, { core: this.core, resource: this.resource });
    let viewport = new Viewport(option);
    this.viewports.set(viewport.id, viewport);
    return viewport;
  }

  removeViewport(id) {
    this.viewports.get(id)?.destroy();
    this.viewports.delete(id);
  }

  getViewport(id) {
    return this.viewports.get(id);
  }

  link(viewports, properties) {}
}

export default ViewportManager;
