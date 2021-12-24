import { evaluate_cmap } from "../../algo/colormap/index";
/**
 * @param { Image } image
 * @param { Array } lut
 * @param { HTMLCanvasElement } renderCanvas
 */
export const renderColormapImage = (image, lut, renderCanvas, colormap) => {
  const { samplesPerPixel, pixelData } = image;
  const { minPixelValue, maxPixelValue } = image;
  const { width, height } = renderCanvas;
  const ctx = renderCanvas.getContext("2d");
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, width, height);
  ctx.imageSmoothingEnabled = false;

  let j = 0;
  let colors = [];

  const { reverse = false, name = "turbo", factor = 1 } = colormap;
  const steps = maxPixelValue - minPixelValue;
  // 提前计算好一次colormap 避免每次运算
  while (j < steps) {
    const color = evaluate_cmap(j / steps, name, reverse);
    colors.push(color);
    j += 1;
  }

  colors.unshift([0, 0, 0, 0]);
  const renderCanvasData = ctx.getImageData(0, 0, width, height);
  let imageDataIndex = 0;
  let numPixels = width * height;
  let i = 0;
  while (i < numPixels) {
    const index = lut[pixelData[i++] + -minPixelValue];
    const rgb = colors[index] ?? [0, 0, 0];
    renderCanvasData.data[imageDataIndex++] = rgb[0]; // Red
    renderCanvasData.data[imageDataIndex++] = rgb[1]; // Green
    renderCanvasData.data[imageDataIndex++] = rgb[2]; // Blue
    renderCanvasData.data[imageDataIndex++] = 255; //lut[pixelData[i++] + -image.minPixelValue];

    i += samplesPerPixel === 4 ? 1 : 0; // 判断如果像素位数为4，则需要调过alpha通道
  }

  ctx.putImageData(renderCanvasData, 0, 0);
};
