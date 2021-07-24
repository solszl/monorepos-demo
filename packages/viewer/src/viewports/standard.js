import AbstractViewport from "./abstract-viewport";
class StandardViewport extends AbstractViewport {
  constructor(option) {
    super(option);
  }

  static create(option) {
    return new StandardViewport(option);
  }
}

export default StandardViewport;
