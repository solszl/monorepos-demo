import BaseTool from "./base/base-tool";
import { INTERNAL_EVENTS, TOOL_TYPE } from "../constants";
import { imageState } from "../state/image-state";
import { randomId } from "./utils";
class WWWCTool extends BaseTool {
  constructor(config = {}) {
    super(config);
    this.isDown = false;
    this.oldOffset = null;
    this.step = null;
    this.type = TOOL_TYPE.WWWC;
    this.name = randomId();
    this._data = {
      id: this.name,
      type: this.type,
      wwwc: { ww: 0, wc: 0 },
    };
  }
  mouseDown(e) {
    super.mouseDown(e);
    const { offsetX, offsetY } = e.evt;
    this.isDown = true;
    this.oldOffset = [offsetX, offsetY];
    this.step = { ww: imageState.wwwc.ww, wc: imageState.wwwc.wc };
  }

  documentMouseMove(e) {
    super.documentMouseMove(e);
    if (!this.isDown) {
      return;
    }
    const wwwc = {
      ww: e.offsetX - this.oldOffset[0] + this.step.ww,
      wc: e.offsetY - this.oldOffset[1] + this.step.wc,
    };
    this.data.wwwc = wwwc;
    this.$stage.fire(INTERNAL_EVENTS.TOOL_WWWC, { wwwc });
  }

  documentMouseUp(e) {
    super.documentMouseUp(e);
    this.isDown = false;
  }
}

export default WWWCTool;
