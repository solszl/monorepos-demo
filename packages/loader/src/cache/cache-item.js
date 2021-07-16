import { createImage } from "@ssaga/dicom";
class CacheItem {
  constructor() {
    this.seriesId = "";
  }

  async a() {
    await createImage(null);
  }
}

export default CacheItem;
