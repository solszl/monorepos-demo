import { Component, RenderSchedule } from "@saga/core";
class AbstractViewport extends Component {
  constructor(option = {}) {
    super();

    this.id = "aaa";
    this.core = option.core;
    /** @type { RenderSchedule } */
    this.renderSchedule = this.core.renderSchedule; // from core instance.
    this._renderer = null;
    this.el = option.el;
    this.canvas = null;
    this.iframe = null;

    this.width = -1;
    this.height = -1;

    this.displayState = {};
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
      this.renderer.resize(width, height);
    };
  }

  _getRootSize() {
    let { clientWidth, clientHeight } = this.el;
    return { width: clientWidth, height: clientHeight };
  }

  showImage(image) {
    this.renderSchedule.invalidate(this.render.bind(this), image);
  }

  async render(image) {
    const { displayState } = this;
    await this.renderer.render(image, displayState);

    const { canvas } = this;
    const { width, height } = canvas;
    // 使用renderData 进行绘制
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);
    // 矩阵变换

    // 绘制
    const { renderData } = this.renderer;
    const { width: rw, height: rh } = renderData;
    ctx.drawImage(renderData, 0, 0, rw, rh, 0, 0, rw, rh);
    this.emit("image_rendered");
  }

  set renderer(val) {
    this._renderer = val;
    const { width, height } = this._getRootSize();
    this.renderer.resize(width, height);
  }

  get renderer() {
    return this._renderer;
  }

  static create() {
    console.error("need implemented by subclass.");
  }
}

export default AbstractViewport;
