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

    this.queue2 = new Map();
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

    if (this.stage.isRunning) {
      this.queue2.set(key, { fn, ctx, args });
      return;
    }

    // 因为函数bind 会返回新的函数， 将旧函数作为闭包包进新函数内。导致map set的时候无法覆盖同一个key
    this.deferredQueue.set(key, { fn, ctx, args });
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

    // for await (const [key, values] of this.deferredQueue?.entries()) {
    //   const { fn, ctx, args } = values;
    //   this.deferredQueue.delete(key);
    //   if (ctx.option.plane === "remote_cpr") {
    //     console.log("cpr call", fn.name, Date.now());
    //   }

    //   console.log("cpr all call", ctx.option.plane, fn.name, Date.now());
    //   await fn?.apply(ctx, args);
    // }

    const allNeedCallFns = this.deferredQueue?.values().reduce((prev, curr) => {
      const { fn, ctx, args } = curr;
      prev.push(fn?.apply(ctx, args));
      return prev;
    }, []);

    // const names = this.deferredQueue?.values().reduce((prev, curr) => {
    //   const { fn, ctx, args } = curr;
    //   prev.push(fn?.name);
    //   return prev;
    // }, []);
    const result = await Promise.all(allNeedCallFns);

    this.deferredQueue.clear();
    // console.log("cpr", names, result);
    this.stage.stopRender();

    // 渲染过程中，又来了新的
    const { size: remainSize } = this.queue2;
    if (remainSize > 0) {
      for (const [key, values] of this.queue2.entries()) {
        this.deferredQueue.set(key, values);
      }

      this.queue2.clear();
      this.validateNow();
    }
  }
}

export default RenderSchedule;
