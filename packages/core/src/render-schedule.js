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
   * @param { Function } fn 需要延迟执行的函数
   * @param { object } ctx 函数上下文
   * @param { any } args 函数参数
   * @memberof RenderSchedule
   */
  invalidate(fn, ctx, ...args) {
    const key = `${ctx.id ?? ""}-${fn.name}`;
    // console.log("插入新调度函数了", key, Date.now());
    // 因为函数bind 会返回新的函数， 将旧函数作为闭包包进新函数内。导致map set的时候无法覆盖同一个key
    this.deferredQueue.set(key, { fn, ctx, args });

    if (this.stage.isRunning) {
      return;
    }
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
  async onValidate() {
    const { size } = this.deferredQueue;
    if (size === 0) {
      this.stage.stopRender();
      return;
    }

    // console.log("call exec.");
    for await (const [key, values] of this.deferredQueue?.entries()) {
      const { fn, ctx, args } = values;
      await fn?.apply(ctx, args);
      this.deferredQueue.delete(key);
    }
    this.stage.stopRender();

    // 渲染过程中，又来了新的
    const { size: remainSize } = this.deferredQueue;
    if (remainSize > 0) {
      this.stage.startRender();
    }
  }
}

export default RenderSchedule;
