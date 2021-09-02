import { INTERNAL_EVENTS } from "../constants";
import BaseTool from "./base/base-tool";
class StackWheelTool extends BaseTool {
  constructor(config = {}) {
    super(config);
    this.delta = 0;
  }
  mouseWheel(e) {
    super.mouseWheel(e);
    console.log(this.delta);
    const { wheelDelta } = e.evt;
    if (wheelDelta < 0) {
      this.delta += 5;
    } else {
      this.delta -= 5;
    }
    // console.log(wheelDelta, this.delta);
    this.$stage.fire(INTERNAL_EVENTS.TOOL_STACK_CHANGE, {
      delta: this.delta,
    });
  }
}

export default StackWheelTool;
