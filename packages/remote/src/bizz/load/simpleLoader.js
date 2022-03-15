import { createImage } from "@pkg/dicom/src";
import AbortController from "abort-controller";

class SimpleLoader {
  constructor() {
    this.isLoading = false;
    this.abortController = new AbortController();
  }

  async load(url) {
    let ab;
    try {
      this.isLoading = true;
      const { signal } = this.abortController;
      ab = await (await fetch(url, { signal })).arrayBuffer();
      this.isLoading = false;
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

  abort() {
    console.log("abort");
    this.abortController.abort();
    this.isLoading = false;
  }

  destroy() {}
}
export default SimpleLoader;
