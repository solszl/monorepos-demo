import Component from "./component";
import RenderSchedule from "./render-schedule";
import Stage from "./stage";

class Core {
  constructor(option = {}) {
    this.option = option;
    this.initialize();

    window.__TX_CORE__ = this;
  }

  initialize() {
    const { option } = this;
    this.stage = new Stage();
    this.stage.fps = +option.fps || 30;
    this.renderSchedule = new RenderSchedule(this.stage);
  }
}

export default Core;
