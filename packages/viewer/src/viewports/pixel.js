import ImageViewport from "./image-viewport";

class PixelViewport extends ImageViewport {
  constructor(option = {}) {
    super(option);
  }

  static create(option) {
    return new PixelViewport(option);
  }
}

export default PixelViewport;
