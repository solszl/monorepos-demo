import { Line } from "konva/lib/shapes/Line";
import { TOOL_COLORS } from "./../../constants";

class Polygon extends Line {
  constructor(config = {}) {
    super(config);
    this._active = false;

    this.stroke(TOOL_COLORS.NORMAL["default-color"]);
    this.strokeWidth(2);
    this.draggable(false);
    this.closed(true);
  }
  active(val) {
    val ? this.stroke(TOOL_COLORS.HOVER["default-color"]) : this.stroke(TOOL_COLORS.NORMAL["default-color"]);
    this._active = val;
  }
}

export default Polygon;
