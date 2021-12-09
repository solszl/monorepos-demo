export const agatstonConfig = [
  Number.MIN_SAFE_INTEGER,
  130,
  200,
  300,
  400,
  Number.MAX_SAFE_INTEGER,
];
export const score = [0, 1, 2, 3, 4];

const calcRangeIndex = (hu) => {
  let index = 0;
  let i = agatstonConfig.length;
  while (i > 0) {
    if (hu > agatstonConfig[i]) {
      index = i;
      break;
    } else {
      i -= 1;
    }
  }

  return index;
};

export const calcAgatston = (image, contourData) => {
  const {
    contourBoundRect: [x0, y0, x1, y1],
    contourCanvas,
    contours,
    key,
  } = contourData;
  const { columns, rows, slope, intercept, instanceNumber, imagePositionPatient } = image;

  let dicomPixel = image.pixelData;
  let contourImageData = contourCanvas.getContext("2d").getImageData(0, 0, columns, rows).data;
  let pixelCount = 0;
  let allHU = 0;
  let map = new Map();
  map.set(0, 0);
  map.set(1, 0);
  map.set(2, 0);
  map.set(3, 0);
  map.set(4, 0);
  for (let x = 0; x <= x1 - x0; x += 1) {
    for (let y = 0; y <= y1 - y0; y += 1) {
      const index = (y + y0) * columns + (x + x0);
      if (contourImageData[index * 4] === 0xff) {
        // get hu
        const hu = dicomPixel[index];
        const ct = hu * slope + intercept;
        // 算分
        const agatstonIndex = calcRangeIndex(ct);
        let key = score[agatstonIndex] || 0;
        let value = map.get(key);
        map.set(key, value + 1);
        pixelCount += 1;
        allHU += ct;
      }
    }
  }

  console.log(map);
  const { columnPixelSpacing, rowPixelSpacing } = image;

  const area = [map.get(1), map.get(2), map.get(3), map.get(4)];
  return {
    [key]: {
      pixelArea: pixelCount,
      avgHU: allHU / pixelCount,
      sliceId: instanceNumber,
      z: imagePositionPatient[2],
      agatstonPixelArea: area.map((a) => a * columnPixelSpacing * rowPixelSpacing),
      contour: contours,
    },
  };
};
