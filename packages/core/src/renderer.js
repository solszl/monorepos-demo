import { INTERNAL_EVENT } from "./internal";
import Stage from "./stage";
class Renderer {
  /**
   * Creates an instance of Renderer.
   * @param { Stage } stage
   * @memberof Renderer
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
   * @memberof Renderer
   */
  invalidate(fn, ...args) {
    this.deferredQueue.set(fn, args);
  }

  /**
   * 立即进行渲染
   *
   * @memberof Renderer
   */
  validateNow() {
    this.onValidate();
  }

  /**
   * 生效函数，该函数通常被stage.enter_frame事件 和 validateNow 函数调用。
   *
   * @return {*}
   * @memberof Renderer
   */
  onValidate() {
    const { size } = this.deferredQueue;
    if (size === 0) {
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

export default Renderer;
