import { Circle } from "konva/lib/shapes/Circle";
import { SELECTOR_ENUM, COLORS } from "../utils";

class Anchor extends Circle {
  constructor(config = {}) {
    super(config);

    this.fill("rgba(0,0,0,0.1)");
    this.stroke(COLORS.normal[SELECTOR_ENUM.Anchor]);
    this.strokeWidth(2);
    this.radius(7);
    this.hitStrokeWidth(16);
    this.draggable(true);
    this.name(SELECTOR_ENUM.Anchor);
  }
}

export default Anchor;
