import { Group } from "konva/lib/Group";
import { activeUtil, cursor } from "../../tools/utils/index";

class UIComponent extends Group {
  constructor(config = {}) {
    super(config);

    // 绑定鼠标交互样式与外观样式。
    this._bindMouseEffect();
  }

  fromData(val) {}

  toData() {}

  _bindMouseEffect() {
    this.on("mouseover", (evt) => {
      cursor(this, "grab");
      activeUtil.on(this);
    });
    this.on("mousedown", (evt) =>{
      cursor(this,'grabbing');
    });
    this.on("mouseout mouseleave", (evt) => {
      cursor(this);
      activeUtil.off(this);
    });
    this.on("dragend", (evt) => {
      cursor(this, "grab");
    });
  }
}

export default UIComponent;
