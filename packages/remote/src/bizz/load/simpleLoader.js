import { createImage } from "@pkg/dicom/src";

class SimpleLoader {
  constructor() {}

  async load(url) {
    let ab;
    try {
      ab = await (await fetch(url)).arrayBuffer();
    } catch (error) {}

    if (!ab) {
      return null;
    }
    const img = await createImage(ab); // 目标业务数据
    if (Array.isArray(img)) {
      if (img.length === 1) {
        img[0].getPixelData = function () {
          return this.pixelData;
        };
      }
      return img[0];
    }

    return img || null;
  }

  destroy() {}
}
export default SimpleLoader;
