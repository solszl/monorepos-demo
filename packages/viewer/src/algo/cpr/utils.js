export const getHu = (data, x, y, z, ratio, imageWidth = 512, imageHeight = 512) => {
  const clamp = (val, min = 0, max = 512) => {
    return Math.min(max, Math.max(val, min));
  };

  x /= ratio;
  y /= ratio;
  z /= ratio;
  z = clamp(z, 0, data.length);
  const x1 = clamp(~~x, 0, imageWidth);
  const y2 = clamp(~~y, 0, imageHeight);
  const fz = clamp(~~z, 0, data.length - 1);
  const x2 = clamp(x1 + 1, 0, imageWidth);
  const y1 = clamp(y2 + 1, 0, imageHeight);
  const cz = clamp(fz + 1, 0, data.length - 1);
  // 双线性插值
  // https://blog.csdn.net/qq_34919792/article/details/102697817
  const fn = (z) => {
    const fQ11 = getHuXYZ(x1, y1, z);
    const fQ21 = getHuXYZ(x2, y1, z);
    const fQ12 = getHuXYZ(x1, y2, z);
    const fQ22 = getHuXYZ(x2, y2, z);

    const hu =
      (fQ11 / ((x2 - x1) * (y2 - y1))) * ((x2 - x) * (y2 - y)) +
      (fQ21 / ((x2 - x1) * (y2 - y1))) * ((x - x1) * (y2 - y)) +
      (fQ12 / ((x2 - x1) * (y2 - y1))) * ((x2 - x) * (y - y1)) +
      (fQ22 / ((x2 - x1) * (y2 - y1))) * ((x - x1) * (y - y1));

    return hu;
  };

  const getHuXYZ = (x, y, z) => {
    return data?.[z]?.[y * imageWidth + x] ?? -2000;
  };

  const hu1 = fn(fz);
  const hu2 = fn(cz);

  const hu = (cz - z) * hu1 + (z - fz) * hu2;
  return ~~hu;
};

export const getDefaultHu = (data, x, y, z, mask, label, imageWidth = 512, imageHeight = 512) => {
  x = Math.round(x);
  y = Math.round(y);
  z = Math.round(z);
  let exist = true;
  if (mask) {
    const index = z * imageHeight * imageWidth + y * imageWidth + x;
    exist = mask.exist(index, label);
  }

  if (data[z] && exist) {
    return data[z][y * imageWidth + x] ?? -2000;
  } else {
    return data?.[0]?.[0] || -2000;
  }
};
