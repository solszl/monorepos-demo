import UIComponent from "../../shape/parts/ui-component";

class BaseTool extends UIComponent {
  constructor(config = {}) {
    super(config);
  }

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
}

export default BaseTool;
