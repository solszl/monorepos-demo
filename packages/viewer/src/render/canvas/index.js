import { getLut } from "./lut";
import { renderColorImage } from "./render-color";
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
    let renderFn = ["rgb", "rgba", true].includes(color) ? renderColorImage : renderGrayImage;
    renderFn(image, lut, renderCanvas);
  }

  get renderData() {
    return this.renderCanvas;
  }

  destroy() {
    this.renderCanvas = null;
  }
}

export default CanvasRenderer;
