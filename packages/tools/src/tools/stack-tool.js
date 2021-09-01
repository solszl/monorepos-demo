import { INTERNAL_EVENTS } from "../constants";
import BaseTool from "./base/base-tool";
class StackTool extends BaseTool {
  constructor(config = {}) {
    super(config);
    this.isDown = false;
  }
  mouseDown(e) {
    super.mouseDown(e);
    this.isDown = true;
  }
  mouseMove(e) {
    super.mouseMove(e);
    if (!this.isDown) {
      return;
    }
    const { movementY } = e.evt;
    if (movementY === 0) {
      return;
    }
    this.$stage.fire(INTERNAL_EVENTS.TOOL_STACK_CHANGE, {
      delta: movementY,
    });
  }
  mouseUp(e) {
    super.mouseUp(e);
    this.isDown = false;
  }
}

export default StackTool;
