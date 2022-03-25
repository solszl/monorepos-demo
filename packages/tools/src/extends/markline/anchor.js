import { Circle } from "konva/lib/shapes/Circle";
import UIComponent from "../../shape/parts/ui-component";

const ANCHOR_CONFIG = {
  radius: 4,
  stroke: "#666",
  fill: "#ddd",
  strokeWidth: 2,
};

/**
 * 血管中线编辑的拖拽点
 *
 * @class Anchor
 * @extends {UIComponent}
 */
class Anchor extends UIComponent {
  constructor(config = {}) {
    super(Object.assign({ draggable: true }, config));

    this.add(new Circle(ANCHOR_CONFIG));

    this.on("dragmove", (e) => {
      this.dispatchEvent({
        type: "anchor_drag_move",
        index: this.index,
        target: this,
      });
    });
    this.on("dragend", (e) => {
      this.dispatchEvent({
        type: "anchor_drag_end",
        index: this.index,
        target: this,
      });
    });
  }

  setIndex(val) {
    this.index = val;
  }

  getIndex() {
    return this.index;
  }

  setOpen(val) {
    val ? this.show() : this.hide();
    this.draggable(val);
  }
}

export default Anchor;
