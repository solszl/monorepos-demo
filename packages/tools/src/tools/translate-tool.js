import { TOOL_TYPE } from "..";
import { INTERNAL_EVENTS } from "../constants";
import { viewportState } from "../state/viewport-state";
import BaseTool from "./base/base-tool";
import { randomId } from "./utils";

class TranslateTool extends BaseTool {
  constructor(config = {}) {
    super(config);
    this.isDown = false;
    this.oldOffset = null;
    this.step = null;
    this.type = TOOL_TYPE.TRANSLATE;
    this.name = randomId();
    this._data = {
      id: this.name,
      type: this.type,
      offset: { x: 0, y: 0 },
    };
  }

  mouseDown(e) {
    super.mouseDown(e);
    const { screenX, screenY } = e.evt;
    this.isDown = true;
    this.oldOffset = [screenX, screenY];
    this.step = { x: viewportState.x, y: viewportState.y };
  }

  documentMouseMove(e) {
    super.documentMouseMove(e);
    if (!this.isDown) {
      return;
    }
    const offset = {
      x: e.screenX - this.oldOffset[0] + this.step.x,
      y: e.screenY - this.oldOffset[1] + this.step.y,
    };
    this.data.offset = offset;
    this.$stage.fire(INTERNAL_EVENTS.TOOL_TRANSLATE, { offset });
  }

  documentMouseUp(e) {
    super.documentMouseUp(e);
    this.isDown = false;
  }
}

export default TranslateTool;
