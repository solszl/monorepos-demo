import { INTERNAL_EVENTS } from "../constants";
import { useViewportState } from "../state/viewport-state";
// import { viewportState } from "../state/viewport-state";
import BaseTool from "./base/base-tool";
class ScaleTool extends BaseTool {
  constructor(config = {}) {
    super(config);
    this.isDown = false;
    this.oldOffsetY = null;
  }

  mouseDown(e) {
    super.mouseDown(e);
    this.isDown = true;
    this.oldOffsetY = e.evt.screenY;
    const stageId = this.$stage.id();
    const [viewportState] = useViewportState(stageId);
    this.scale = viewportState().scale;
  }

  documentMouseMove(e) {
    super.documentMouseMove(e);
    if (!this.isDown) {
      return;
    }
    const stepY = e.screenY - this.oldOffsetY;
    this.oldOffsetY = e.screenY;

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
    this.isDown && this.$stage.fire(INTERNAL_EVENTS.TOOL_SCALE, { scale: this.scale });
  }

  documentMouseUp(e) {
    super.documentMouseUp(e);
    this.isDown = false;
  }
}

export default ScaleTool;
