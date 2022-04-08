import { Core } from "@pkg/core/src";
import LinkageManager from "./linkage-manager";
import TimeTracer from "./utils/time-tracer";
import Viewport from "./view-bridge";
class ViewportManager {
  constructor() {
    /** @type { Map <string, AbstractViewport > } */
    this.viewports = new Map();
    // TODO: 理论上会有动态调整参数的概念，但是还未实现
    this.core = new Core({ fps: 30 });
    this.tracer = new TimeTracer();
    this.linkManager = new LinkageManager(this.viewports);
    window.__TX_VIEWPORT_MANAGER__ = this;
  }

  /**
   * 添加一个viewport到管理器
   *
   * @param { object} option
   * @return { AbstractViewport } viewport
   * @memberof ViewportManager
   */
  addViewport(option) {
    // 将核心选调度器传入
    Object.assign(option, { core: this.core, resource: this.resource, tracer: this.tracer });
    let viewport = new Viewport(option);
    this.viewports.set(viewport.id, viewport);
    return viewport;
  }

  /**
   * 移除viewport
   *
   * @param { string } id 要进行处理的viewportId
   * @param {boolean} [purgeAll=true] 是否将缓存和任务进行一并处理，再多个viewport显示同一套数据集的时候，建议将该参数设置为：false
   * @memberof ViewportManager
   */
  removeViewport(id, purgeAll = true) {
    if (!this.viewports.has(id)) {
      return;
    }

    if (purgeAll) {
      const { option } = this.viewports.get(id);
      const { transferMode, seriesId } = option;
      const transfer = this?.resource?.getTransfer(transferMode);
      transfer?.purgeCache?.(seriesId);
      transfer?.purgeTasks?.(seriesId);
    }

    this.linkManager.removeViewport(id);
    this.viewports.get(id)?.destroy();
    this.viewports.delete(id);
  }

  /**
   * 获取指定id 的viewport
   *
   * @param { string } id
   * @return { AbstractViewport } viewport
   * @memberof ViewportManager
   */
  getViewport(id) {
    return this.viewports.get(id);
  }

  verboseLogging(val) {
    this.tracer.enable = val;
  }
}

export default ViewportManager;
