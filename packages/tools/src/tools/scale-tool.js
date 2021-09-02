import BaseTool from "./base/base-tool";
import { INTERNAL_EVENTS, TOOL_TYPE } from "../constants";
import { viewportState } from "../state/viewport-state";
import { randomId } from "./utils";
class ScaleTool extends BaseTool {
  constructor(config = {}) {
    super(config);
    this.type = TOOL_TYPE.SCALE;
    this.isDown = false;
    this.offsetY = null;
    this.name = randomId();
    this._data = {
      id: this.name,
      type: this.type,
      scale: viewportState.scale,
    };
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
    const oldFactor = Math.log(this.data.scale) / Math.log(pow);
    const factor = oldFactor + ticks;
    this.data.scale = Math.pow(pow, factor);

    if (this.data.scale < 0.05) {
      this.data.scale = 0.05;
    } else if (this.data.scale > 10) {
      this.data.scale = 10;
    }
    this.$stage.fire(INTERNAL_EVENTS.TOOL_SCALE, { scale: this.data.scale });
  }

  documentMouseUp(e) {
    super.documentMouseUp(e);
    this.isDown = false;
  }
}

export default ScaleTool;
