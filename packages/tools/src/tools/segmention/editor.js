/* eslint-disable no-unused-expressions */
import ShadowCanvas from "./shadow-canvas";
import Context from "./strategies/context";
import { getDrawStrategy, getEraseStrategy } from "./strategies/index";
import { findBoundingRect } from "./utils/find-bounding-rect";
import { findContours } from "./utils/find-contours";
import { rectIntersect } from "./utils/rect-intersect";

class ContourEditor {
  constructor(viewport) {
    const {
      option: { el },
    } = viewport;
    this.el = el;
    this.backgroundCanvas = new ShadowCanvas();
    this.shadowCanvas = new ShadowCanvas();
    this.currentDrawStrategy = null;
    this.currentEraseStrategy = null;
    this.useHotkeyForErase = false;

    this.context = new Context();
    this.context.useCanvas(this.shadowCanvas);
    this.data = {};
  }

  start(strategyConfig = { draw: "dauber", eraser: "dauber", useHotkey: true }) {
    const iframe = this.el.querySelector("iframe");
    if (!iframe) {
      console.error("uninitialized content.");
      return;
    }

    iframe.addEventListener("resize", this._resizeShadowCanvas.bind(this));
    this.el.appendChild(this.backgroundCanvas.getCanvas());
    this.el.appendChild(this.shadowCanvas.getCanvas());
    this._resizeShadowCanvas();
    this.useStrategies(strategyConfig);
  }

  stop() {
    this.context.terminate();

    const iframe = this.el.querySelector("iframe");
    iframe && iframe.removeEventListener("resize", this._resizeShadowCanvas);
    this.el.removeChild(this.backgroundCanvas.getCanvas());
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
    const { drawStrategy } = this.context;
    this.context.useStrategy(drawStrategy);
    this.context.setUseSingleStrategy(false);
    this.context.execute();
  }

  useStrategy(strategyString) {
    const [type, key] = strategyString.split(".");
    this.context.setUseSingleStrategy(true);
    let strategy = null;
    switch (type) {
      case "draw":
        strategy = getDrawStrategy(key);
        this.context.useDraw(strategy);
        break;
      case "erase":
        strategy = getEraseStrategy(key);
        this.context.useEraser(strategy);
        break;
      default:
        break;
    }

    if (!strategy) {
      return;
    }
    this.context.useStrategy(strategy);
    this.context.execute();
  }

  setStrokeWidth(val) {
    this.context.setStrokeWidth(val);
  }

  /**
   *
   *
   * @param { Array } sourceContours
   * @param { Array } newContours
   * @param { Object } [config={ width: 512, height: 512 }]
   * @memberof ContourEditor
   */
  unionContours(sourceContours, newContours, config = {}) {
    const { width = 512, height = 512 } = config;
    // draw source contour
    // draw new contour
    // extract contour

    const canvas = new ShadowCanvas();
    window.unionCanvas = canvas;
    canvas.resize(width, height);
    canvas.clear();
    const ctx = canvas.getContext();
    ctx.fillStyle = "red";

    this._draw(ctx, sourceContours);
    this._draw(ctx, newContours);

    const buffer = canvas.getImageDataBuffer();
    const contourConfig = Object.assign({}, config, { thresholds: 0x20, smooth: true });
    const { coordinates: contours } = findContours(buffer, contourConfig);
    // TODO: remove me.
    let tempContainer = document.querySelector("#temp");
    const c = canvas.getCanvas();
    c.style.position = "";
    tempContainer && tempContainer.appendChild(c);

    return {
      contours,
      contourCanvas: canvas.getCanvas(),
      contourBoundRect: findBoundingRect(contours),
    };
  }

  /**
   *
   *
   * @param { Array } sourceContours
   * @param { Array } newContours
   * @param { Object } config
   * @return {*}
   * @memberof ContourEditor
   */
  subtractContours(sourceContours, newContours, config) {
    // 计算新画的contour的总外边框
    let newContourRect = newContours.reduce(
      (prev, current) => {
        const rect = findBoundingRect(current);
        return [
          Math.min(prev[0], rect[0]),
          Math.min(prev[1], rect[1]),
          Math.max(prev[2], rect[2]),
          Math.max(prev[3], rect[3]),
        ];
      },
      [
        Number.MAX_SAFE_INTEGER,
        Number.MAX_SAFE_INTEGER,
        -Number.MAX_SAFE_INTEGER,
        -Number.MAX_SAFE_INTEGER,
      ]
    );

    const { width = 512, height = 512, boundRect } = config;

    const canvas = new ShadowCanvas();
    canvas.resize(width, height);
    canvas.clear();
    const ctx = canvas.getContext();
    ctx.fillStyle = "red";

    this._draw(ctx, [sourceContours]);
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    this._draw(ctx, newContours);
    ctx.restore();

    const intersect = rectIntersect(newContourRect, boundRect);
    if (!intersect) {
      return {
        contours: sourceContours,
        contourCanvas: canvas.getCanvas(),
        contourBoundRect: findBoundingRect(sourceContours),
      };
    }

    console.log("rect0 ", boundRect);
    console.log("rect1", newContourRect);
    console.log("是否相交", rectIntersect(newContourRect, boundRect));
    const buffer = canvas.getImageDataBuffer();
    const contourConfig = Object.assign({}, config, { thresholds: 0x20, smooth: true });
    const { coordinates: contours } = findContours(buffer, contourConfig);
    // TODO: remove me.
    let tempContainer = document.querySelector("#temp");
    const c = canvas.getCanvas();
    c.style.position = "";
    tempContainer && tempContainer.appendChild(c);

    return {
      contours,
      contourCanvas: canvas.getCanvas(),
      contourBoundRect: findBoundingRect(contours),
    };
  }

  _draw(ctx, data) {
    data.forEach((contours) => {
      ctx.beginPath();
      contours.forEach((contour) => {
        contour.forEach((p, index) => {
          if (index === 0) {
            ctx.moveTo(p[0], p[1]);
          } else {
            ctx.lineTo(p[0], p[1]);
          }
        });
      });
      ctx.closePath();
      ctx.fill("evenodd");
    });
  }

  _resizeShadowCanvas() {
    const { clientWidth: w, clientHeight: h } = this.el;
    this.shadowCanvas.resize(w, h);
    this.backgroundCanvas.resize(w, h);
  }

  setDataAndKey(sliceKey, key) {
    this.shadowCanvas.clear();
    this.backgroundCanvas.clear();
    const data = this.data[sliceKey] ?? new Map();
    data.forEach((value) => {
      const { key: contourKey, points, useCustomColourConfig, colour } = value;
      let ctx =
        contourKey === key ? this.shadowCanvas.getContext() : this.backgroundCanvas.getContext();
      if (useCustomColourConfig) {
        const { fillColor } = colour;
        ctx.fillStyle = fillColor;
      }
      this._draw(ctx, [points]);
    });
  }

  regOperateCallback(handler) {
    this.shadowCanvas.mouseUpHandlerCallback = handler;
  }
}

export default ContourEditor;
