import { INTERNAL_EVENTS } from "../constants";
import BaseTool from "./base/base-tool";
class StackWheelTool extends BaseTool {
  constructor(config = {}) {
    super(config);
  }
  mouseWheel(e) {
    super.mouseWheel(e);
    const { wheelDelta } = e.evt;

    this.$stage.fire(INTERNAL_EVENTS.TOOL_STACK_CHANGE, {
      delta: -Math.sign(wheelDelta),
    });
  }
}

export default StackWheelTool;
