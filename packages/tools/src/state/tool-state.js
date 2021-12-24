import { TOOL_CONSTRUCTOR } from "../constructor";

const completeState = {
  isComplete: true,
  button: 1,
};

export const setActionComplete = (val) => {
  completeState.isComplete = val;
};

class ToolState {
  constructor() {
    // 左中右键绑定的工具集, 绑定的是枚举值
    this.state = {
      1: null,
      2: null,
      3: null,
      // 鼠标中键滚轮行为
      4: null,
    };
    this.toolInstance = {};
    this.$transform = null;
  }

  updateState(toolType, button = 1) {
    if (!Reflect.ownKeys(this.state).includes(`${button}`)) {
      console.warn(`unsupported button,${button}. should be [1,2,3,4].`);
      return;
    }

    if (toolType === "") {
      this.state[button] = null;
      return;
    }

    this.state[button] = toolType;
  }

  getToolType(button) {
    return this.state?.[button];
  }

  getToolInstance(button, needInitial = false) {
    if (completeState.isComplete) {
      const toolType = this.state?.[button];
      if (!toolType) {
        return;
      }

      if (needInitial) {
        this.toolInstance[button] = new TOOL_CONSTRUCTOR[toolType]();
        this.toolInstance[button].$stage = this.$stage;
        this.toolInstance[button].$transform = this.$transform;
        completeState.button = button;
      }

      return this.toolInstance[button];
    } else {
      // 绘制未完成，继续上次工具操作
      if (button === completeState.button) {
        return this.toolInstance[button];
      }
      if (button !== 0) {
        // 未完成且更换按键，强制结束
        setActionComplete(true);
        this.toolInstance[completeState.button].mouseUp();
      }
      return this.toolInstance[completeState.button];
    }
  }
}

export default ToolState;
