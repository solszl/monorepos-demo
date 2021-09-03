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
      currentTransform: null,
    };
    window.view = this;

    this.init();
  }

  init() {
    this.initContainer();
    this.initCanvas();
    // this.initResize();
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
    this.viewerContainer.insertBefore(this.canvas, this.viewerContainer.firstChild);
  }

  initResize() {
    const className = "tx-resizer";
    const tempIframe = this.el.querySelector(`.${className}`);
    if (tempIframe) {
      return;
    }

    let lastEmitResize = -1;
    const resizeHandler = (e) => {
      if (Date.now() - lastEmitResize <= 100) {
        return;
      }
      lastEmitResize = Date.now();
      this._sizeChanged = true;
      this._calcSuitableSizeRatio();
      this.renderSchedule.invalidate(this.render.bind(this), this.image);
      this.emit(VIEWER_INTERNAL_EVENTS.ROOT_SIZE_CHANGED, this._getRootSize());
    };
    this.iframe = document.createElement("iframe");
    this.iframe.style.cssText = `position: absolute;top: 0;left: 0;width: 100%;height: 100%;border: 0; pointer-events:none;`;
    this.iframe.classList = [className];
    this.el.style.position = "relative";
    this.el.style.overflow = "hidden";
    this.viewerContainer.insertBefore(this.iframe, this.viewerContainer.firstChild);
    this.iframe.contentWindow.onresize = resizeHandler;
  }

  showImage(image) {
    this.image = image;
    const { width: rw, height: rh } = this.renderer.renderData;
    const { columns, rows } = image;
    if (rw !== rows || rh !== columns) {
      this.renderer.renderData.width = columns;
      this.renderer.renderData.height = rows;
      this._calcSuitableSizeRatio();
    }
    this._displayChanged = true;
    this.renderSchedule.invalidate(this.render.bind(this), image);
    this.emit(VIEWER_INTERNAL_EVENTS.SLICE_CHANGED, {
      seriesId: image.seriesId,
      sliceId: image.instanceNumber,
    });
  }

  async render(image) {
    if (!image) {
      return;
    }

    let needDraw = false;

    if (this._displayChanged) {
      const { displayState } = this;
      await this.renderer.render(image, displayState);
      this._displayChanged = false;
      needDraw = true;
    }

    const { width, height } = this._getRootSize();
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }

    if (needDraw) {
      const ctx = this.canvas.getContext("2d");
      ctx.fillStyle = "black";
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    if (
      this._flipChanged ||
      this._positionChanged ||
      this._rotateChanged ||
      this._scaleChanged ||
      this._sizeChanged
    ) {
      const { renderData } = this.renderer;
      this.displayState.currentTransform = applyTransform(
        this.displayState,
        this.canvas,
        this.renderer.renderData
      );

      // 矩阵变换
      this._flipChanged = false;
      this._positionChanged = false;
      this._rotateChanged = false;
      this._scaleChanged = false;
      this._sizeChanged = false;

      const { width: rootWidth, height: rootHeight } = this._getRootSize();
      const { scale, rotate, offset = { x: 0, y: 0 } } = this.displayState;
      const position = [
        (rootWidth - renderData.width * scale) / 2,
        (rootHeight - renderData.height * scale) / 2,
      ];

      this.emit(VIEWER_INTERNAL_EVENTS.MATRIX_CHANGED, {
        width: renderData.width,
        height: renderData.height,
        scale: scale || 1,
        rootSize: this._getRootSize(),
        rotate: rotate || 0,
        offset: offset || [0, 0],
        seriesId: this.image?.seriesId,
        sliceId: this.image?.instanceNumber,
        position,
      });
      needDraw = true;
    }

    // 绘制
    if (needDraw) {
      const { renderData } = this.renderer;
      const { width, height } = renderData;
      const ctx = this.canvas.getContext("2d");
      ctx.setTransform(...this.displayState.currentTransform);
      // 使用renderData 进行绘制
      ctx.drawImage(renderData, 0, 0, width, height, 0, 0, width, height);

      this.emit(VIEWER_INTERNAL_EVENTS.IMAGE_RENDERED, {
        wwwc: {
          ww: this.displayState?.wwwc?.ww ?? this.image?.windowWidth,
          wc: this.displayState?.wwwc?.wc ?? this.image?.windowCenter,
        },
        columns: this.image.columns,
        rows: this.image.rows,
        pixelData: this.image.pixelData,
        seriesId: this.image.seriesNum,
        sliceId: this.image.instanceNumber,
        columnPixelSpacing: this.image.columnPixelSpacing,
        rowPixelSpacing: this.image.rowPixelSpacing,
      });
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
    console.log(val);
    this._propertySetter({ scale: val }, "_scaleChanged");
  }

  setTranslation(val) {
    this._propertySetter({ translation: val }, "_positionChanged");
  }

  _getRootSize() {
    let { clientWidth, clientHeight } = this.el;
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

  resize(width, height) {
    this._sizeChanged = true;
    this._calcSuitableSizeRatio();
    this.renderSchedule.invalidate(this.render.bind(this), this.image);
    this.emit(VIEWER_INTERNAL_EVENTS.ROOT_SIZE_CHANGED, { width, height });
  }

  static create() {
    console.error("need implemented by subclass.");
  }
}

export default AbstractViewport;
