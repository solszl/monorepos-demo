import { getColorLut, getLut } from "./lut";
import { renderColorImage } from "./render-color";
import { renderColormapImage } from "./render-colormap";
import { renderGrayImage } from "./render-gray";
class CanvasRenderer {
  constructor() {
    this.type = "canvas";
    this.renderCanvas = document.createElement("canvas");
  }

  async render(image, displayState, extend = {}) {
    const { renderCanvas } = this;
    const { colormap } = extend;
    // 如果设置颜色表
    const lut = getColorLut(image, displayState, colormap) ?? getLut(image, displayState);
    const { color } = image;

    if (displayState.colormap) {
      // FIXME: 解决特殊图像
      image.windowWidth = 255;
      image.windowCenter = 127;
      image.intercept = 0;
      renderColormapImage(image, lut, renderCanvas, displayState.colormap);
    } else {
      const renderFn = ["rgb", "rgba"].includes(color) ? renderColorImage : renderGrayImage;
      renderFn(image, lut, renderCanvas);
    }
  }

  get renderData() {
    return this.renderCanvas;
  }

  destroy() {
    this.renderCanvas = null;
  }
}

export default CanvasRenderer;
