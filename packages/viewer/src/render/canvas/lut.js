const lutCache = {};
export const getLut = (image, displayState) => {
  const { wwwc, invert = false } = displayState;
  let { windowWidth, windowCenter } = image;
  if (wwwc?.ww && wwwc?.wc) {
    windowCenter = wc;
    windowWidth = ww;
  }

  const cacheKey = `${windowWidth}-${windowCenter}-${+invert}`;
  if (!lutCache[cacheKey]) {
    lutCache[cacheKey] = generateLut(image, windowWidth, windowCenter, invert);
  }

  // 做一个缓存清理机制
  if (Reflect.ownKeys(lutCache).length > 50) {
    lutCache = {};
  }
  return lutCache[cacheKey];
};

const generateLut = (image, windowWidth, windowCenter, invert) => {
  const { minPixelValue, maxPixelValue } = image;
  const offset = Math.min(minPixelValue, 0);

  const length = maxPixelValue - offset + 1;
  let lut = new Uint8ClampedArray(length);

  const { slope, intercept } = image;
  const mLutFn = linearModalityLut(slope, intercept);
  const wwwcLutFn = wwwcLut(windowWidth, windowCenter);

  if (!invert) {
    for (let i = minPixelValue; i <= maxPixelValue; i += 1) {
      lut[i - offset] = wwwcLutFn(mLutFn(i));
    }
  } else {
    for (let i = minPixelValue; i <= maxPixelValue; i += 1) {
      lut[i - offset] = 255 - wwwcLutFn[mLutFn[i]];
    }
  }

  return lut;
};

const linearModalityLut = (slope, intercept) => {
  return (pixelValue) => {
    return pixelValue * slope + intercept;
  };
};

const wwwcLut = (ww, wc) => {
  return (mlutValue) => {
    return ((mlutValue - wc) / ww + 0.5) * 255.0;
  };
};
