import { Group } from "konva/lib/Group";
import { activeUtil, cursor } from "../../tools/utils/index";

class UIComponent extends Group {
  constructor(config = {}) {
    super(config);

    if (config.useDefaultMouseEffect ?? true) {
      // 绑定鼠标交互样式与外观样式。
      this._bindMouseEffect();
    }
  }

  _bindMouseEffect() {
    let dragging = false;
    this.on("mouseover", (evt) => {
      cursor(this, "grab");
      activeUtil.on(this);
    });
    this.on("mousedown", (evt) => {
      cursor(this, "grabbing");
      dragging = true;
    });
    this.on("mouseout mouseleave", (evt) => {
      if (dragging) {
        return;
      }
      cursor(this);
      activeUtil.off(this);
    });
    this.on("dragend", (evt) => {
      cursor(this, "grab");
      dragging = false;
    });
  }
}

export default UIComponent;
