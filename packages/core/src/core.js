import Component from "./component";
import Renderer from "./renderer";
import Stage from "./stage";

class Core {
  constructor(option = {}) {
    this.option = option;
    this.initialize();
  }

  initialize() {
    const { option } = this;
    this.stage = new Stage();
    this.stage.fps = +option.fps || 30;
    this.renderer = new Renderer(this.stage);
  }
}

export default Core;
