/**
 * @param { Image } image
 * @param { Array } lut
 * @param { HTMLCanvasElement } renderCanvas
 */
export const renderColorImage = (image, lut, renderCanvas) => {
  // 默认使用alpha 通道的数据渲染
  const { width, height } = renderCanvas;
  const ctx = renderCanvas.getContext("2d");
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, width, height);
  ctx.imageSmoothingEnabled = false;

  let imageDataIndex = 3;
  let numPixels = width * height;
  let offset = invert ? 255 : 0;
  let i = 0;
};
