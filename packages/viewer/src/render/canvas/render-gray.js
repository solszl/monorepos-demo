/**
 * @param { Image } image
 * @param { Array } lut
 * @param { HTMLCanvasElement } renderCanvas
 */
export const renderGrayImage = (image, lut, renderCanvas) => {
  // 默认使用alpha 通道的数据渲染
  const { pixelData, minPixelValue } = image;
  const { width, height } = renderCanvas;
  const ctx = renderCanvas.getContext("2d");
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, width, height);
  ctx.imageSmoothingEnabled = false;
  const renderCanvasData = ctx.getImageData(0, 0, width, height);

  let imageDataIndex = 3;
  let numPixels = width * height;
  let i = 0;

  while (i < numPixels) {
    renderCanvasData.data[imageDataIndex] = lut[pixelData[i++] + -minPixelValue];
    imageDataIndex += 4;
  }

  ctx.putImageData(renderCanvasData, 0, 0);
};
