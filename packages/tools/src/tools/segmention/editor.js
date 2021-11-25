import ShadowCanvas from "./shadow-canvas";
import Context from "./strategies/context";
import { getDrawStrategy, getEraseStrategy, getStrategy } from "./strategies/index";

class ContourEditor {
  constructor(viewport) {
    const {
      option: { el },
    } = viewport;
    this.el = el;
    this.shadowCanvas = new ShadowCanvas();
    this.currentDrawStrategy = null;
    this.currentEraseStrategy = null;
    this.useHotkeyForErase = false;

    this.context = new Context();
    this.context.useCanvas(this.shadowCanvas);
    console.log("editor", el);
  }

  start(strategyConfig = { draw: "dauber", eraser: "dauber", useHotkey: true }) {
    const iframe = this.el.querySelector("iframe");
    if (!iframe) {
      console.error("uninitialized content.");
      return;
    }

    iframe.addEventListener("resize", this._resizeShadowCanvas.bind(this));
    this.el.appendChild(this.shadowCanvas.getCanvas());
    this._resizeShadowCanvas();
    this.useStrategies(strategyConfig);
  }

  stop() {
    this.context.terminate();

    const iframe = this.el.querySelector("iframe");
    iframe?.removeEventListener("resize", this._resizeShadowCanvas);
    this.el.removeChild(this.shadowCanvas.getCanvas());
  }

  /**
   * 使用策略方案
   *
   * @param {*} config
   * @memberof ContourEditor
   */
  useStrategies(config) {
    const { draw, eraser, useHotkey } = config;
    this.context.useDraw(getDrawStrategy(draw));
    this.context.useEraser(getEraseStrategy(eraser));
    this.context.useHotkey(useHotkey);
    this.context.setUseSingleStrategy(false);
    this.context.execute();
  }

  useStrategy(key) {
    const strategy = getStrategy(key);
    this.context.setUseSingleStrategy(true);
    this.context.useStrategy(strategy);
    this.context.execute();
  }

  setStrokeWidth(val) {
    this.context.setStrokeWidth(val);
  }

  _resizeShadowCanvas() {
    const { clientWidth: w, clientHeight: h } = this.el;
    this.shadowCanvas.resize(w, h);
  }
}

export default ContourEditor;
