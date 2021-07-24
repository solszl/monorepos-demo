class WebglRenderer {
  constructor() {
    this.type = "webgl";
    this.renderCanvas = document.createElement("canvas");
  }

  async render(image, displayState) {}

  resize(width, height) {
    this.renderCanvas.width = width;
    this.renderCanvas.height = height;
  }

  get renderData() {
    return this.renderCanvas;
  }
}

export default WebglRenderer;
