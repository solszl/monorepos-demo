// 小数保留精度
const PRECISION = 2;
export const roi = (image, roiData) => {
  const { start, end, position } = roiData;
  const width = Math.abs(start.x + position.x - (end.x + position.x));
  const height = Math.abs(start.y + position.y - (end.y + position.y));
  const x = Math.round(Math.min(start.x + position.x, end.x + position.x));
  const y = Math.round(Math.min(start.y + position.y, end.y + position.y));
  const a = Math.abs(start.x - end.x) / 2;
  const b = Math.abs(start.y - end.y) / 2;
  const center = [(start.x + end.x) / 2 + position.x, (start.y + end.y) / 2 + position.y];
  const ellipsePixels = getEllipsePixels(image, { width, height, x, y, a, b, center });

  const area = getArea(a, b, image);
  const others = getOthers(ellipsePixels);

  return {
    area,
    ...others,
  };
};

const getEllipsePixels = (image, opt) => {
  const { width, height, x, y, a, b, center } = opt;
  const { columns, pixelData, slope, intercept } = image;
  let ellipsePixels = [];
  let index = 0;

  for (let row = 0; row < height; row += 1) {
    for (let column = 0; column < width; column += 1) {
      if (isInEllipse(a, b, column + x, row + y, center)) {
        const pixelDataIndex = (row + y) * columns + (column + x);
        const ct = toHU(pixelData[pixelDataIndex], slope, intercept);
        ellipsePixels[index++] = ct;
      }
    }
  }

  return ellipsePixels;
};

const toHU = (val, slope, intercept) => {
  return val * slope + intercept;
};

const getArea = (a, b, image) => {
  const { columnPixelSpacing = 0.625, rowPixelSpacing = 0.625 } = image;
  return +(Math.PI * a * b * columnPixelSpacing * rowPixelSpacing).toFixed(PRECISION);
};

const getOthers = (pixelData) => {
  let min = Number.MAX_SAFE_INTEGER;
  let max = Number.MIN_SAFE_INTEGER;
  let sum = 0;
  let s = 0;

  for (let i = 0; i < pixelData.length; i++) {
    const item = pixelData[i];
    sum += item;
    min = Math.min(min, item);
    max = Math.max(max, item);
  }

  // 平均数
  const avg = +(sum / pixelData.length).toFixed(PRECISION);
  // (x1 - M)^2 + (x2 - M)^2 + ...... +(xn - M)^2
  for (let i = 0; i < pixelData.length; i++) {
    const item = pixelData[i];
    s += Math.pow(item - avg, 2);
  }

  // 方差
  const variance = +Math.sqrt(s / pixelData.length).toFixed(PRECISION);
  return {
    min,
    max,
    avg,
    variance,
  };
};

const isInEllipse = (a, b, x, y, center) => {
  return (
    Math.pow(x - center[0], 2) / Math.pow(a, 2) + Math.pow(y - center[1], 2) / Math.pow(b, 2) <= 1
  );
};
