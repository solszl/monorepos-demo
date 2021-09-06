import { verify } from "../../area";
import { TOOL_ITEM_SELECTOR, TOOL_TYPE } from "../../constants";
import TextField from "../../shape/parts/textfield";
import { imageState } from "../../state/image-state";
import BaseAnnotationTool from "../base/base-annotation-tool";
import { randomId, toCT } from "../utils";
import { worldToLocal } from "../utils/coords-transform";
class ProbeTool extends BaseAnnotationTool {
  constructor(config = {}) {
    super(Object.assign({}, config, { useDefaultMouseEffect: false }));
    this.type = TOOL_TYPE.PROBE;
    const name = randomId();
    this.name(name);
    this._data = {
      id: name,
      type: this.type,
      position: { x: 0, y: 0 },
    };
  }

  mouseDown(e) {
    super.mouseDown(e);
    this.initialUI();
    this.data.position = this.$stage.getPointerPosition();
    this.renderData();
  }

  mouseMove(e) {
    super.mouseMove(e);
    this.data.position = this.$stage.getPointerPosition();
    this.renderData();
  }

  mouseUp(e) {
    super.mouseUp(e);
    this.remove();
  }

  initialUI() {
    super.initialUI();
    const textfield = new TextField();
    textfield.setPosition({ x: 20, y: 10 });
    textfield.draggable(false);
    textfield.show();
    this.add(textfield);
    const toolLayer = this.$stage.findOne("#toolsLayer");
    toolLayer.add(this);

    this.UIInitialed = true;
  }

  renderData() {
    super.renderData();
    const { position } = this.data;
    const textfield = this.findOne(`.${TOOL_ITEM_SELECTOR.LABEL}`);
    this.setPosition(position);
    if (!verify(position.x, position.y)) {
      textfield.hide();
      return;
    }
    const point = worldToLocal(position.x, position.y);
    textfield.show();
    const ctValue = this._getCT(Math.round(point[0]), Math.round(point[1]));
    textfield.text(`CT: ${ctValue}`);
  }

  _getCT(x, y) {
    const index = y * imageState.columns + x;
    return toCT([imageState.pixelData[index]], imageState.slope, imageState.intercept);
  }
}

export default ProbeTool;
