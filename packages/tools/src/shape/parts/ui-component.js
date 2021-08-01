import { Group } from "konva/lib/Group";
import { activeUtil, cursor } from "../utils/index";

class UIComponent extends Group {
  constructor(config = {}) {
    super(config);

    this.on("mouseover", this._onMouseOver.bind(this));
    this.on("mouseout mouseleave", this._onMouseOut.bind(this));
  }

  fromData(val) {}

  toData() {}

  _onMouseOver(event) {
    cursor(this, "pointer");
    activeUtil.on(this);
  }

  _onMouseOut(event) {
    cursor(this);
    activeUtil.off(this);
  }
}

export default UIComponent;
