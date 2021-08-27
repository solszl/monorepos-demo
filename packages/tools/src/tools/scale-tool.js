import BaseTool from "./base/base-tool";
import { INTERNAL_EVENTS } from "../constants";
import { viewportState } from "../state/viewport-state";
class ScaleTool extends BaseTool {
  constructor(config = {}) {
    super(config);
    this.isDown = false;
    this.offsetY = null;
    this.scale = viewportState.scale;
  }

  mouseDown(e) {
    super.mouseDown(e);
    this.isDown = true;
    this.offsetY = e.evt.offsetY;
  }

  documentMouseMove(e) {
    super.documentMouseMove(e);
    if (!this.isDown) {
      return;
    }
    const stepY = e.offsetY - this.offsetY;
    this.offsetY = e.offsetY;

    const ticks = stepY / 200;
    const pow = 1.7;
    const oldFactor = Math.log(this.scale) / Math.log(pow);
    const factor = oldFactor + ticks;
    this.scale = Math.pow(pow, factor);

    if (this.scale < 0.05) {
      this.scale = 0.05;
    } else if (this.scale > 10) {
      this.scale = 10;
    }
    this.isDown &&
      this.$stage.fire(INTERNAL_EVENTS.TOOL_SCALE, { scale: this.scale });
  }

  documentMouseUp(e) {
    super.documentMouseUp(e);
    this.isDown = false;
  }
}

export default ScaleTool;
