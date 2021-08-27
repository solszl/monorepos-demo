import BaseTool from "./base/base-tool";
import { INTERNAL_EVENTS } from "../constants";
import { viewportState } from "../state/viewport-state";

class TranslateTool extends BaseTool {
  constructor(config = {}) {
    super(config);
    this.isDown = false;
    this.oldOffset = null;
    this.step = null;
  }

  mouseDown(e) {
    super.mouseDown(e);
    const { offsetX, offsetY } = e.evt;
    this.isDown = true;
    this.oldOffset = [offsetX, offsetY];
    this.step = { x: viewportState.x, y: viewportState.y };
  }

  documentMouseMove(e) {
    super.documentMouseMove(e);
    if (!this.isDown) {
      return;
    }
    const offset = {
      x: e.offsetX - this.oldOffset[0] + this.step.x,
      y: e.offsetY - this.oldOffset[1] + this.step.y,
    };
    this.$stage.fire(INTERNAL_EVENTS.TOOL_TRANSLATE, { offset });
  }

  documentMouseUp(e) {
    super.documentMouseUp(e);
    this.isDown = false;
  }
}

export default TranslateTool;
