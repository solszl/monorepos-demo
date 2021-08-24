import { TOOL_CONSTRUCTOR } from "./constants";

class ToolState {
  constructor() {
    // 左中右键绑定的工具集, 绑定的是枚举值
    this.state = {
      1: null,
      2: null,
      3: null,
    };
    this.toolInstance = {};
  }

  updateState(toolType, button = 1) {
    if (!Reflect.ownKeys(this.state).includes(`${button}`)) {
      console.warn(`unsupported button,${button}. should be [1,2,3].`);
      return;
    }

    this.state[button] = toolType;
  }

  getToolType(button) {
    return this.state?.[button];
  }

  getToolInstance(button, needInitial = false) {
    const toolType = this.state?.[button];
    if (!toolType) {
      return;
    }

    if (needInitial) {
      this.toolInstance[button] = new TOOL_CONSTRUCTOR[toolType]();
      this.toolInstance[button].$stage = this.$stage;
    }
    return this.toolInstance[button];
  }
}

export default ToolState;
