import { Line } from "konva/lib/shapes/Line";
import { TOOL_COLORS, TOOL_ITEM_SELECTOR } from "./../../constants";

class DashLine extends Line {
  constructor(config = {}) {
    super(config);

    this.stroke(TOOL_COLORS.NORMAL[TOOL_ITEM_SELECTOR.DASHLINE]);
    this.strokeWidth(2);
    this.lineJoin("round");
    this.dash([6, 3]);
    this.name(TOOL_ITEM_SELECTOR.DASHLINE);
  }
}

export default DashLine;
