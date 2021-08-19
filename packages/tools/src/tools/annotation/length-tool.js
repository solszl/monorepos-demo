import BaseAnnotationTool from "../base/base-annotation-tool";
import { TOOL_TYPE } from "../../constants";

class LengthTool extends BaseAnnotationTool {
  constructor(config = {}) {
    super(config);
    this.type = TOOL_TYPE.LENGTH;
  }
}

export default LengthTool;
