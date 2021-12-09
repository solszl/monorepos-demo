// import { arrayToObject } from "./utils/array-to-object";
import { findContours } from "./utils/find-contours";
import { throttle } from "./utils/throttle";
// import { simplifyContours } from "./utils/simplify-contours";

class ShadowCanvas {
  constructor() {
    this._cvs = document.createElement("canvas");
    this._cvs.style.zIndex = 3;
    this._cvs.style.position = "absolute";
    this.width = -1;
    this.height = -1;
    this.strokeWidth = 10;

    this._ee = {
      mousedown: this._mouseDownHandler.bind(this),
      mousemove: this._mouseMoveHandler.bind(this),
      mouseup: this._mouseUpHandler.bind(this),
      mouseleave: this._mouseOutHandler.bind(this),
      mouseout: this._mouseOutHandler.bind(this),
    };

    this.mouseUpHandlerCallback = null;
  }

  clear() {
    this.getContext().clearRect(0, 0, this.width, this.height);
  }

  resize(w, h) {
    this._cvs.width = w;
    this._cvs.height = h;
    this._cvs.style.width = `${w}px`;
    this._cvs.style.height = `${h}px`;
    this.width = w;
    this.height = h;
    this.imageDataBuffer = new Uint32Array();
  }

  getContext() {
    return this._cvs.getContext("2d");
  }

  getCanvas() {
    return this._cvs;
  }

  getImageData(sx, sy, sw, sh) {
    return this.getContext()?.getImageData(sx, sy, sw, sh);
  }

  getImageDataBuffer() {
    const buffer = new Uint32Array(this.getImageData(0, 0, this.width, this.height).data.buffer);
    return buffer;
  }

  setDrawMode(mode) {
    // 目前只有2种模式，刷子模式和橡皮擦模式。
    const globalCompositeOperation = mode === "brush" ? "source-over" : "destination-out";
    this.getContext().globalCompositeOperation = globalCompositeOperation;
  }

  setStrokeWidth(val) {
    this.strokeWidth = val;
  }

  unbindEvents() {
    const c = this.getCanvas();
    Object.entries(this._ee).map(([key, fn]) => {
      c.removeEventListener(key, fn);
    });
  }

  bindEvents() {
    this.unbindEvents();
    const c = this.getCanvas();
    Object.entries(this._ee).map(([key, fn]) => {
      c.addEventListener(key, fn);
    });
  }

  injectStrategy(brush) {
    this.brush = brush;
    this.brush.shadowCanvas = this;
    console.log("inject  ", brush);
  }

  findContour() {
    const data = this.getImageDataBuffer();
    // find contours
    const { coordinates: contours } = findContours(data);
    return contours;

    // simplify contours
    // const result = contours.map((contour) => {
    //   let temp = contour.map((c) => {
    //     let result = [];
    //     c.reduce((prev, val) => {
    //       prev.push(arrayToObject(val));
    //       return prev;
    //     }, result);

    //     return result;
    //   });

    //   let temp2 = temp.map((c) => {
    //     return simplifyContours(c);
    //   });
    //   return temp2;
    // });

    // let canvas = document.createElement("canvas");
    // canvas.width = 512;
    // canvas.height = 512;
    // document.body.appendChild(canvas);
    // let ctx = canvas.getContext("2d");

    // ctx.clearRect(0, 0, 512, 512);
    // ctx.lineWidth = 2;
    // ctx.fillStyle = "red";
    // ctx.lineCap = "round";
    // ctx.lineJoin = "round";

    // result.forEach((contours, i) => {
    //   ctx.beginPath();
    //   contours.forEach((contour, ii) => {
    //     contour.forEach((p, index) => {
    //       if (index === 0) {
    //         ctx.moveTo(p.x, p.y);
    //       } else {
    //         ctx.lineTo(p.x, p.y);
    //       }
    //     });
    //   });
    //   ctx.closePath();
    //   ctx.fill("evenodd");
    //   ctx.stroke();
    // });
    // return result;
  }

  _mouseDownHandler(e) {
    this.isMouseDown = true;
    this.brush.setStrokeWidth(this.strokeWidth);
    this.brush.onMouseDown(e);
  }
  _mouseUpHandler(e) {
    this.isMouseDown = false;
    this.brush.onMouseUp(e);

    throttle(this.mouseUpHandlerCallback());
  }
  _mouseMoveHandler(e) {
    if (!this.isMouseDown) {
      return;
    }

    this.brush.onMouseMove(e);
  }

  _mouseOutHandler(e) {
    if (!this.isMouseDown) {
      return;
    }
    this.isMouseDown = false;
    this.brush.onMouseUp(e);
    throttle(this.mouseUpHandlerCallback());
  }

  pointInContour(x, y) {
    const { width } = this;
    const index = y * width + x;
    const buffer = this.getImageDataBuffer();
    return buffer.at(index) !== 0;
  }
}

export default ShadowCanvas;
