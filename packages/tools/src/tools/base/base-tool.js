import UIComponent from "../../shape/parts/ui-component";
import { activeUtil } from "../utils";

class BaseTool extends UIComponent {
  constructor(config = {}) {
    super(config);
    this._data = null;
    this.UIInitialed = false;
  }

  initialUI() {}
  verifyDataLegal() {}
  convertLocalCoords(data) {}
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
  documentMouseMove(e) {}
  documentMouseUp(e) {}

  set data(val) {
    this._data = val;
    this.careStageEvent = false;
    if (!this.UIInitialed) {
      this.initialUI();
      activeUtil.off(this);
    }
    this.renderData();
  }

  get data() {
    return this._data;
  }

  setData(val) {
    this._data = val;
  }

  verify(x, y, width, height) {
    const { $transform: transform } = this;
    const [ox, oy] = transform.invertPoint(x, y);
    return ox >= 0 && ox <= width && oy >= 0 && oy <= height;
  }
}

export default BaseTool;
