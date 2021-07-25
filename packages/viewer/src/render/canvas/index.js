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

    const { columns, rows } = image;
    const { width, height } = this.renderCanvas;
    if (columns !== width || rows !== height) {
      this.renderCanvas.width = columns;
      this.renderCanvas.height = rows;
    }

    renderFn(image, lut, renderCanvas);
  }

  get renderData() {
    return this.renderCanvas;
  }
}

export default CanvasRenderer;
