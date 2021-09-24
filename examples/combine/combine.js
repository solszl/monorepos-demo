class CombineImage {
  constructor() {}

  execute(images) {
    const [img0, img1, img2] = images;
    let target = Object.assign({}, img0);

    const { columns, rows } = img0;
    target.samplesPerPixel = 4;
    target.color = "rgb";
    let pixelData = new Uint8Array(columns * rows * 4);
    const { pixelData: px0 } = img0;
    const { pixelData: px1 } = img1;
    const { pixelData: px2 } = img2;

    let i = 0;
    let index = 0;
    let numPixels = columns * rows * 4;
    while (i < numPixels) {
      pixelData[i++] = px0[index];
      pixelData[i++] = px1[index];
      pixelData[i++] = px2[index];
      pixelData[i++] = 255;
      index += 1;
    }

    target.pixelData = pixelData;

    return target;
  }
}

export default CombineImage;
