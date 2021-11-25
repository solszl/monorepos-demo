import Mousetrap from "mousetrap";
import ShadowCanvas from "../shadow-canvas";
class Context {
  constructor() {
    /** @type { ShadowCanvas } */
    this.shadowCanvas = null;
    this.drawStrategy = null;
    this.eraseStrategy = null;

    this.strokeWidth = 10;

    this.useSingleStrategy = false;
    this.singleStrategy = null;

    this.shiftKeyHandler = {
      up: (e) => {
        this.shadowCanvas.injectStrategy(this.drawStrategy);
      },
      down: (e) => {
        this.shadowCanvas.injectStrategy(this.eraseStrategy);
      },
    };

    this.lineStrokeWidthHandler = {
      increase: (e) => {
        this.strokeWidth += 1;
        this.setStrokeWidth(this.strokeWidth);
      },
      decrease: (e) => {
        this.strokeWidth -= 1;
        this.setStrokeWidth(this.strokeWidth);
      },
    };
  }

  useCanvas(shadowCanvas) {
    this.shadowCanvas = shadowCanvas;
  }

  useDraw(strategy) {
    if (!strategy) {
      return;
    }

    if (this.drawStrategy) {
      const tempStrategy = new strategy();
      if (this.drawStrategy.type !== tempStrategy) {
        this.drawStrategy = tempStrategy;
      }
      return;
    }

    this.drawStrategy = new strategy();
    this.shadowCanvas.injectStrategy(this.drawStrategy);
  }

  useEraser(strategy) {
    if (!strategy) {
      return;
    }

    if (this.eraseStrategy) {
      const tempStrategy = new strategy();
      if (this.eraseStrategy.type !== tempStrategy) {
        this.eraseStrategy = tempStrategy;
      }
      return;
    }

    this.eraseStrategy = new strategy();
  }

  useHotkey(val) {
    // remove
    Mousetrap.unbind("shift", this.shiftKeyHandler.down, "keydown");
    Mousetrap.unbind("shift", this.shiftKeyHandler.up, "keyup");
    Mousetrap.unbind("[", this.lineStrokeWidthHandler.decrease);
    Mousetrap.unbind("]", this.lineStrokeWidthHandler.increase);

    if (val) {
      Mousetrap.bind("shift", this.shiftKeyHandler.down, "keydown");
      Mousetrap.bind("shift", this.shiftKeyHandler.up, "keyup");
      Mousetrap.bind("[", this.lineStrokeWidthHandler.decrease);
      Mousetrap.bind("]", this.lineStrokeWidthHandler.increase);
    }
  }

  useStrategy(strategy) {
    this.strategy = strategy;
    this.shadowCanvas.injectStrategy(this.strategy);
  }

  /**
   *
   *
   * @param { number } val 笔触大小， 限定在1~20px
   * @memberof Context
   */
  setStrokeWidth(val) {
    this.shadowCanvas.setStrokeWidth(Math.max(1, Math.min(val, 20)));
  }

  setUseSingleStrategy(val) {
    this.useSingleStrategy = val;
  }

  execute() {
    this.shadowCanvas.bindEvents();
  }

  terminate() {}
}

export default Context;
