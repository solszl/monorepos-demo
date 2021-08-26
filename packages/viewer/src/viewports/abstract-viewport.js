import { Component, RenderSchedule } from "@saga/core";
import { validate } from "../validator";
import { applyTransform } from "../transform/apply";
import { VIEWER_INTERNAL_EVENTS } from "../constants";
class AbstractViewport extends Component {
  constructor(option = {}) {
    super(option);

    this.core = option.core;
    /** @type { RenderSchedule } */
    this.renderSchedule = this.core.renderSchedule; // from core instance.
    this.renderer = null;
    this.el = option.el;
    this.canvas = null;
    this.iframe = null;

    this.displayState = {
      flip: { h: false, v: false },
      scale: 1,
    };

    this.init();
  }

  init() {
    this.initContainer();
    this.initCanvas();
    this.initResize();
  }

  initContainer() {
    const viewerContainer = document.createElement("div");
    viewerContainer.classList.add("dicom-container");
    viewerContainer.style.cssText = `position: absolute;top: 0;left: 0;width: 100%;height: 100%;border: 0; z-index:2;`;
    this.viewerContainer = viewerContainer;

    this.el.style.position = "relative";
    this.el.style.overflow = "hidden";
    this.el.insertBefore(viewerContainer, this.el.firstChild);
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
    // this.el.appendChild(canvas);
    // this.el.insertBefore(this.canvas, this.el.firstChild);
    this.viewerContainer.insertBefore(
      this.canvas,
      this.viewerContainer.firstChild
    );
  }

  initResize() {
    this.iframe = document.createElement("iframe");
    this.iframe.style.cssText = `position: absolute;top: 0;left: 0;width: 100%;height: 100%;border: 0;`;
    this.el.style.position = "relative";
    this.el.style.overflow = "hidden";
    // this.el.insertBefore(this.iframe, this.el.firstChild);
    this.viewerContainer.insertBefore(
      this.iframe,
      this.viewerContainer.firstChild
    );
    let lastEmitResize = -1;
    this.iframe.contentWindow.onresize = (e) => {
      if (Date.now() - lastEmitResize <= 100) {
        return;
      }
      lastEmitResize = Date.now();
      this._sizeChanged = true;
      this._calcSuitableSizeRatio();
      this.renderSchedule.invalidate(this.render.bind(this), this.image);
      this.emit(VIEWER_INTERNAL_EVENTS.ROOT_SIZE_CHANGED, this._getRootSize());
    };
  }

  showImage(image) {
    this.image = image;
    const { width: rw, height: rh } = this.renderer.renderData;
    const { columns, rows } = image;
    if (rw !== rows || rh !== columns) {
      this.renderer.renderData.width = rows;
      this.renderer.renderData.height = columns;
      this._calcSuitableSizeRatio();
    }
    this._displayChanged = true;
    this.renderSchedule.invalidate(this.render.bind(this), image);
    this.emit(VIEWER_INTERNAL_EVENTS.SLICE_CHANGED, {
      seriesId: image.seriesNum,
      sliceId: image.instanceNumber,
    });
  }

  async render(image) {
    let needDraw = false;

    if (this._displayChanged) {
      const { displayState } = this;
      await this.renderer.render(image, displayState);
      this._displayChanged = false;
    }

    const { width, height } = this._getRootSize();
    const { canvas } = this;
    if (canvas.width !== width || canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }

    if (
      this._flipChanged ||
      this._positionChanged ||
      this._rotateChanged ||
      this._scaleChanged ||
      this._sizeChanged
    ) {
      const { renderData } = this.renderer;
      const matrix = applyTransform(this.displayState, canvas, renderData);
      const ctx = canvas.getContext("2d");
      ctx.setTransform(...matrix);
      ctx.save();

      const { width, height } = canvas;
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, width, height);

      ctx.restore();
      // 矩阵变换
      this._flipChanged = false;
      this._positionChanged = false;
      this._rotateChanged = false;
      this._scaleChanged = false;
      this._sizeChanged = false;
      needDraw = true;
    }

    // 绘制
    if (needDraw) {
      const { renderData } = this.renderer;
      const { width, height } = renderData;
      const ctx = canvas.getContext("2d");
      // 使用renderData 进行绘制
      ctx.drawImage(renderData, 0, 0, width, height, 0, 0, width, height);

      const { width: rootWidth, height: rootHeight } = this._getRootSize();
      const { scale, rotate } = this.displayState;
      const offset = [
        (rootWidth - width * scale) / 2,
        (rootHeight - height * scale) / 2,
      ];
      this.emit(VIEWER_INTERNAL_EVENTS.IMAGE_RENDERED, {
        width,
        height,
        scale: scale || 1,
        rootSize: this._getRootSize(),
        rotate: rotate || 0,
        position: this.displayState.position || [0, 0],
        offset,
      });
      needDraw = false;
    }
  }

  setWWWC(val) {
    this._propertySetter({ wwwc: val }, "_displayChanged", false);
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
    const isValidate = this._propertySetter({ scale: val }, "_scaleChanged");
    if (this.image && isValidate) {
      this.emit(VIEWER_INTERNAL_EVENTS.SCALE_CHANGED, {
        seriesId: this.image.seriesNum,
        sliceId: this.image.instanceNumber,
        scale: val,
      });
    }
  }

  setTranslation(val) {
    this._propertySetter({ translation: val }, "_positionChanged");
  }

  _getRootSize() {
    let { clientWidth, clientHeight } = this.el;
    this._positionChanged = clientWidth !== clientHeight;
    return { width: clientWidth, height: clientHeight };
  }

  _propertySetter(val, effectProperty, merge = true) {
    if (!validate(this.displayState, val)) {
      return false;
    }

    if (merge) {
      Object.assign(this.displayState, val);
    }

    this[effectProperty] = true;
    this.renderSchedule.invalidate(this.render.bind(this), this.image);
    return true;
  }

  _calcSuitableSizeRatio() {
    // 根据renderCanvas的大小计算缩放尺寸（如果有的话）
    if (!this?.renderer?.renderData) {
      return;
    }
    const { width, height } = this._getRootSize();
    const { width: rw, height: rh } = this.renderer.renderData;
    const screenRatio = width / height;
    let scaleResult = width / rw;
    let imageRatio = rw / rh;
    if (screenRatio > imageRatio) {
      scaleResult = height / rh;
    }
    this.setScale(scaleResult);
  }

  static create() {
    console.error("need implemented by subclass.");
  }
}

export default AbstractViewport;
