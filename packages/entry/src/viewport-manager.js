import { Core } from "@saga/core";
import Viewport from "./view-bridge";
import DataManager from "./data-manager";

class ViewportManager {
  constructor() {
    this.viewports = {};
    // TODO: 理论上会有动态调整参数的概念，但是还未实现
    this.core = new Core({ fps: 30 });
    this.dataManager = new DataManager();
    window.__TX_VIEWPORT_MANAGER__ = this;
  }

  addViewport(option) {
    // 将核心选调度器传入
    Object.assign(option, { core: this.core });
    let viewport = new Viewport(option);
    this.viewports[viewport.id] = viewport;
    return viewport;
  }

  removeViewport(id) {
    const viewport = this.viewports?.[id];
    viewport?.destroy();
    delete this.viewports?.[id];
  }
}

export default ViewportManager;
