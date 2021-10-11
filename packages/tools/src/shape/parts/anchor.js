import { Circle } from "konva/lib/shapes/Circle";
import { TOOL_COLORS, TOOL_CONSTANTS, TOOL_ITEM_SELECTOR } from "./../../constants";

class Anchor extends Circle {
  constructor(config = {}) {
    super(config);

    this.fill("rgba(0,0,0,0.1)");
    this.stroke(TOOL_COLORS.NORMAL[TOOL_ITEM_SELECTOR.ANCHOR]);
    this.strokeWidth(2);
    this.radius(7);
    this.hitStrokeWidth(TOOL_CONSTANTS.ANCHOR_HIT_STROKE_WIDTH);
    this.draggable(true);
    this.name(TOOL_ITEM_SELECTOR.ANCHOR);
  }
}

export default Anchor;
