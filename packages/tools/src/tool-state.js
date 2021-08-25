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
    // TODO：  改！代码整理
    if (!completeState.isComplete && button === completeState.button) {
      return this.toolInstance[button];
    }

    if (!completeState.isComplete && button !== 0) {
      completeState.isComplete = true;
      this.toolInstance[completeState.button].mouseUp();
    }

    const toolType = this.state?.[button];
    if (!toolType && completeState.isComplete) {
      return;
    }

    if (needInitial && completeState.isComplete) {
      this.toolInstance[button] = new TOOL_CONSTRUCTOR[toolType]();
      this.toolInstance[button].$stage = this.$stage;
      completeState.button = button;
    }

    if (!completeState.isComplete) {
      button = completeState.button;
    }

    return this.toolInstance[button];
  }
}

const completeState = {
  isComplete: true,
  button: 1,
};
export default ToolState;
export const setActionComplete = (val) => {
  completeState.isComplete = val;
};
