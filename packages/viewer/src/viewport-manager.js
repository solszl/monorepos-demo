import CanvasRenderer from "./render/canvas";
import WebglRenderer from "./render/webgl";
import { webglSupported } from "./render/webgl/utils";
import StandardViewport from "./viewports/standard";
class ViewportManager {
  constructor() {
    this.viewports = {};
    this.core = null;
    window.__TX_VIEWPORT_MANAGER__ = this;
  }

  addViewport(option) {
    let viewport = null; // 视窗
    // 使用canvas 还是 webgl 去渲染。
    let renderer =
      option.renderer === "webgl"
        ? webglSupported()
          ? new WebglRenderer()
          : new CanvasRenderer()
        : new CanvasRenderer();

    option.core = this.core;
    switch (option.plane) {
      case "standard":
        viewport = StandardViewport.create(option);
        break;
    }

    viewport.renderer = renderer; // 设置渲染器
    const { id } = viewport;
    this.viewports[id] = viewport;
  }

  removeViewport(id) {
    const viewport = this.viewports?.[id];
    viewport?.destroy();
    delete this.viewports?.[id];
  }
}

export default ViewportManager;
