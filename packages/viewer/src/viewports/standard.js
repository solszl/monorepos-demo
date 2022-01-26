import ImageViewport from "./image-viewport";
class StandardViewport extends ImageViewport {
  constructor(option) {
    super(option);
  }

  static create(option) {
    return new StandardViewport(option);
  }
}

export default StandardViewport;
