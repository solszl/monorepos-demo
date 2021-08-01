import { Line } from "konva/lib/shapes/Line";
import { COLORS, SELECTOR_ENUM } from "../utils";

class DashLine extends Line {
  constructor(config = {}) {
    super(config);

    this.stroke(COLORS.normal[SELECTOR_ENUM.DASHLINE]);
    this.strokeWidth(2);
    this.lineJoin("round");
    this.dash([6, 3]);
    this.name(SELECTOR_ENUM.DASHLINE);
  }
}

export default DashLine;
