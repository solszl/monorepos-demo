import { Component, RenderSchedule } from "@saga/core";
import { validate } from "../validator";
import { applyTransform } from "../transform/apply";
class AbstractViewport extends Component {
  constructor(option = {}) {
    super();

    this.id = "aaa";
    this.core = option.core;
    /** @type { RenderSchedule } */
    this.renderSchedule = this.core.renderSchedule; // from core instance.
    this.renderer = null;
    this.el = option.el;
    this.canvas = null;
    this.iframe = null;

    this.width = -1;
    this.height = -1;

    this.displayState = {
      flip: { h: false, v: false },
      scale: 1,
    };

    this.init();
  }

  init() {
    this.initCanvas();
    this.initResize();
  }

  initCanvas() {
    const canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.style.display = "block";
    canvas.style.zIndex = "1";
    let { width, height } = this._getRootSize();
    canvas.width = width;
    canvas.height = height;
    this.canvas = canvas;
    this.canvas.className = "__tx-dicom";
    this.canvas.id = this.id;
    this.el.appendChild(canvas);
  }

  initResize() {
    this.iframe = document.createElement("iframe");
    this.iframe.style.cssText = `position: absolute;top: 0;left: 0;width: 100%;height: 100%;border: 0;`;
    this.el.style.position = "relative";
    this.el.style.overflow = "hidden";
    this.el.insertBefore(this.iframe, this.el.firstChild);
    this.iframe.contentWindow.onresize = (e) => {
      const { width, height } = this._getRootSize();
      this.width = width;
      this.height = height;
    };
  }

  showImage(image) {
    this.image = image;
    this._displayChanged = true;
    this.renderSchedule.invalidate(this.render.bind(this), image);
  }

  async render(image) {
    let needDraw = false;

    if (this._displayChanged) {
      const { displayState } = this;
      await this.renderer.render(image, displayState);
      this._displayChanged = false;
      needDraw = true;
    }

    const { canvas } = this;
    const ctx = canvas.getContext("2d");
    const { renderData } = this.renderer;
    const { width: rw, height: rh } = renderData;

    if (needDraw) {
      const { width, height } = canvas;
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, width, height);
    }

    if (this._flipChanged || this._positionChanged || this._rotateChanged || this._scaleChanged) {
      const matrix = applyTransform(this.displayState, canvas, renderData);
      ctx.setTransform(...matrix);
      // 矩阵变换
      this._flipChanged = false;
      this._positionChanged = false;
      this._rotateChanged = false;
      this._scaleChanged = false;
      needDraw = true;
    }

    // 绘制
    if (needDraw) {
      // 使用renderData 进行绘制
      ctx.drawImage(renderData, 0, 0, rw, rh, 0, 0, rw, rh);
      this.emit("image_rendered");
      needDraw = false;
    }
  }

  setWWWC(val) {
    this._propertySetter({ wwwc: val }, "_displayChanged");
  }

  setInvert(val) {
    this._propertySetter({ invert: val }, "_displayChanged");
  }

  setOffset(val) {
    this._propertySetter({ offset: val }, "_positionChanged");
  }

  setRotation(val) {
    this._propertySetter({ rotate: val }, "_rotateChanged");
  }

  setFlipV(val) {
    this._propertySetter({ flip: { v: val } }, "_flipChanged");
  }

  setFlipH(val) {
    this._propertySetter({ flip: { h: val } }, "_flipChanged");
  }

  setScale(val) {
    this._propertySetter({ scale: val }, "_scaleChanged");
  }

  setTranslation(val) {
    this._propertySetter({ translation: val }, "_positionChanged");
  }

  _getRootSize() {
    let { clientWidth, clientHeight } = this.el;
    this._positionChanged = clientWidth !== clientHeight;
    return { width: clientWidth, height: clientHeight };
  }

  _propertySetter(val, effectProperty) {
    if (!validate(this.displayState, val)) {
      return;
    }

    Object.assign(this.displayState, val);
    this[effectProperty] = true;
    this.renderSchedule.invalidate(this.render.bind(this), this.image);
  }

  static create() {
    console.error("need implemented by subclass.");
  }
}

export default AbstractViewport;
