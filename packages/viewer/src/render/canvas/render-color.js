/**
 * @param { Image } image
 * @param { Array } lut
 * @param { HTMLCanvasElement } renderCanvas
 */
export const renderColorImage = (image, lut, renderCanvas) => {
  const { samplesPerPixel, pixelData } = image;
  const { width, height } = renderCanvas;
  const ctx = renderCanvas.getContext("2d");
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, width, height);
  ctx.imageSmoothingEnabled = false;

  const renderCanvasData = ctx.getImageData(0, 0, width, height);
  let imageDataIndex = 0;
  let numPixels = width * height;
  let i = 0;
  while (i < numPixels * samplesPerPixel) {
    renderCanvasData.data[imageDataIndex++] = lut[pixelData[i++] + -image.minPixelValue]; // Red
    renderCanvasData.data[imageDataIndex++] = lut[pixelData[i++] + -image.minPixelValue]; // Green
    renderCanvasData.data[imageDataIndex++] = lut[pixelData[i++] + -image.minPixelValue]; // Blue
    renderCanvasData.data[imageDataIndex++] = lut[pixelData[i++] + -image.minPixelValue];
  }

  ctx.putImageData(renderCanvasData, 0, 0);
};
