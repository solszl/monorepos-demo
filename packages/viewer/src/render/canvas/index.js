import { renderColorImage } from "./render-color";
import { getLut } from "./lut";
import { renderGrayImage } from "./render-gray";
class CanvasRenderer {
  constructor() {
    this.type = "canvas";
    this.renderCanvas = document.createElement("canvas");
  }

  async render(image, displayState) {
    const { renderCanvas } = this;
    const lut = getLut(image, displayState);
    const { color } = image;
    let renderFn = color ? renderColorImage : renderGrayImage;
    renderFn(image, lut, renderCanvas);
  }

  get renderData() {
    return this.renderCanvas;
  }
}

export default CanvasRenderer;
