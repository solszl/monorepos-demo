import BaseTool from "./base-tool";

class BaseAnnotationTool extends BaseTool {
  constructor(config = {}) {
    super(config);
    this.careStageEvent = true;
  }

  dragAnchor(evt) {
    // implements by subclass.
    this.careStageEvent = false;
  }

  dragText(evt) {
    // implements by subclass.
    this.careStageEvent = false;
  }

  drag(evt) {
    // implements by subclass.
    this.careStageEvent = false;
  }

  dragEnd(evt) {
    this.careStageEvent = false;
  }
}

export default BaseAnnotationTool;
