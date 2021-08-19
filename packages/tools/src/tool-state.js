import { TOOL_CONSTRUCTOR } from "./constants";

class ToolState {
  constructor() {
    // 左中右键绑定的工具集, 绑定的是枚举值
    this.state = {
      0: null,
      1: null,
      2: null,
    };
    this.toolInstance = {};
  }

  updateState(toolType, button = 0) {
    if (!Reflect.ownKeys(this.state).includes(button)) {
      console.warn(`unsupported button,${button}. should be [0,1,2].`);
      return;
    }

    this.state[button] = toolType;

    const _instance = this.toolInstance[button];
    if (_instance.type === toolType) {
      return;
    }

    this.toolInstance[button] = new TOOL_CONSTRUCTOR[toolType]();
  }
}

export default ToolState;
