import Component from "./component";
import Renderer from "./renderer";
import Stage from "./stage";

class Core {
  constructor(option = {}) {
    this.option = option;
    this.initialize();
    console.log("init completed");
  }

  initialize() {
    const { option } = this;
    this.stage = new Stage();
    this.stage.fps = +option.fps || 30;
    this.renderer = new Renderer(this.stage);

    const com = new Component();
    window.com = com;
  }
}

export default Core;
