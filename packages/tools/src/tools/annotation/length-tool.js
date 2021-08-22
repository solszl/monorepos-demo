import BaseAnnotationTool from "../base/base-annotation-tool";
import { TOOL_TYPE } from "../../constants";

class LengthTool extends BaseAnnotationTool {
  constructor(config = {}) {
    super(config);
    this.type = TOOL_TYPE.LENGTH;
  }

  mouseDown(evt) {
    super.mouseDown(evt);
  }

  mouseClick(e) {
    console.log("left click");
  }
  mouseRightClick(e) {
    console.log("right click");
  }
  mouseDoubleClick(e) {}
  mouseWheelClick(e) {
    console.log("wheel click");
  }
}

export default LengthTool;
