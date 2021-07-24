import { INTERNAL_EVENT } from "./internal";
import Stage from "./stage";
class RenderSchedule {
  /**
   * Creates an instance of RenderSchedule.
   * @param { Stage } stage
   * @memberof RenderSchedule
   */
  constructor(stage) {
    /** 延迟渲染队列 */
    this.deferredQueue = new Map();
    /** @type { Stage } */
    this.stage = stage;
    this.stage.on(INTERNAL_EVENT.ENTER_FRAME, this.onValidate.bind(this));
  }

  /**
   * 将待更新函数放入延迟渲染队列
   *
   * @param {*} fn
   * @param {*} args
   * @memberof RenderSchedule
   */
  invalidate(fn, ...args) {
    this.deferredQueue.set(fn, args);
    this.stage.startRender();
  }

  /**
   * 立即进行渲染
   *
   * @memberof RenderSchedule
   */
  validateNow() {
    this.onValidate();
  }

  /**
   * 生效函数，该函数通常被stage.enter_frame事件 和 validateNow 函数调用。
   *
   * @return {*}
   * @memberof RenderSchedule
   */
  onValidate() {
    const { size } = this.deferredQueue;
    if (size === 0) {
      this.stage.stopRender();
      return;
    }

    for (const [fn, values] of this.deferredQueue?.entries()) {
      fn?.(...values);
      this.deferredQueue.delete(fn);
    }

    // 渲染过程中，又来了新的
    const { size: remainSize } = this.deferredQueue;
    if (remainSize > 0) {
      this.validateNow();
    }
  }
}

export default RenderSchedule;
