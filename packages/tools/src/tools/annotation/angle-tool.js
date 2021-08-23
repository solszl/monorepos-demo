import BaseAnnotationTool from "../base/base-annotation-tool";
import { randomId } from "../utils";
class AngleTool extends BaseAnnotationTool {
  constructor(config = {}) {
    super(config);
    this._data = {
      id: randomId(),
      start: { x: 0, y: 0 },
      middle: { x: 0, y: 0 },
      end: { x: 0, y: 0 },
      textBox: { dragged: false, x: 0, y: 0, text: "" },
    };
  }

  mouseDown(evt) {
    super.mouseDown(evt);
    console.log("angle down");
  }
}

export default AngleTool;
