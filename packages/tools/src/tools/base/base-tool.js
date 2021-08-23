import UIComponent from "../../shape/parts/ui-component";

class BaseTool extends UIComponent {
  constructor(config = {}) {
    super(config);
    this._data = null;
  }

  initialUI() {}
  verifyDataLegal() {}
  renderData() {}

  mouseEnter(e) {}
  mouseLeave(e) {}
  mouseOver(e) {}
  mouseOut(e) {}
  mouseMove(e) {}
  mouseDown(e) {}
  mouseUp(e) {}
  mouseClick(e) {}
  mouseRightClick(e) {}
  mouseDoubleClick(e) {}
  mouseWheel(e) {}
  mouseWheelClick(e) {}

  set data(val) {
    this._data = val;
    this.renderData();
  }

  get data() {
    return this._data;
  }
}

export default BaseTool;
