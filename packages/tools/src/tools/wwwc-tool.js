import BaseTool from "./base/base-tool";
import { INTERNAL_EVENTS } from "../constants";
import { imageState } from "../state/image-state";
class WWWCTool extends BaseTool {
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
    this.$stage.fire(INTERNAL_EVENTS.TOOL_WWWC, { wwwc });
  }

  documentMouseUp(e) {
    super.documentMouseUp(e);
    this.isDown = false;
  }
}

export default WWWCTool;
