class WebglRenderer {
  constructor() {
    this.type = "webgl";
    this.renderCanvas = document.createElement("canvas");
  }

  async render(image, displayState) {}

  get renderData() {
    return this.renderCanvas;
  }

  destroy() {
    this.renderCanvas = null;
  }
}

export default WebglRenderer;
