/**
 * 2d 数据集
 *
 * @class Volume
 */
class Volume {
  constructor() {
    this.minValue = Number.MAX_SAFE_INTEGER;
    this.maxValue = Number.MIN_SAFE_INTEGER;
    this.data = null;
  }

  pretreatmentData(allImageData) {
    const [img0, img1] = allImageData;
    const { rows, columns } = img0;
    const perLength = rows * columns;
    this.data = new Uint8ClampedArray(perLength * allImageData.length);
    // orientation, position, spacing, thickness, betweenSliceThickness etc..
    allImageData.forEach((image, index) => {
      const { pixelData, minPixelValue, maxPixelValue } = image;
      this.data.set(pixelData, index * perLength);
      this.minValue = this.minValue > minPixelValue ? minPixelValue : this.minValue;
      this.maxValue = this.maxValue < maxPixelValue ? maxPixelValue : this.maxValue;
    });

    console.log(this);
  }
}

export default Volume;
