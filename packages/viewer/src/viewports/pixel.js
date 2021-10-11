import AbstractViewport from "./abstract-viewport";

class PixelViewport extends AbstractViewport {
  constructor(option = {}) {
    super(option);
  }

  static create(option) {
    return new PixelViewport(option);
  }
}

export default PixelViewport;
