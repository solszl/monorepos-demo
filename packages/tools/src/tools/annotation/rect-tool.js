import { verify } from "../../area";
import { INTERNAL_EVENTS, TOOL_TYPE } from "../../constants";
import Polygon from "../../shape/parts/polygon";
import TextField from "../../shape/parts/textfield";
import { useViewportState } from "../../state/viewport-state";
import BaseAnnotationTool from "../base/base-annotation-tool";
import { randomId } from "../utils";

class RectTool extends BaseAnnotationTool {
  constructor(config = {}) {
    super(config);
    this.type = TOOL_TYPE.RECT;
    const name = randomId();
    this.name(name);
    this._data = {
      id: name,
      type: this.type,
      position: config.position ?? { x: 0, y: 0 },
      points: config.points ?? [],
      active: false,
    };
    this.$stage = config.stage;

    this._init();
  }

  _init() {
    const [viewportState] = useViewportState(this.$stage.id());
    this.viewportState = viewportState();

    this.initialUI();
    this.renderData();
  }

  renderData() {
    super.renderData();
    const { position, points, active } = this.data;
    this.setPosition(position);
    this.findOne("#poly")?.points(points);
    this.findOne("#poly")?.active(active);
    this._tryUpdateData();
  }

  verifyDataLegal() {
    const { points, position } = this.data;
    const { width, height } = this.viewportState;
    const arr = [];

    new Array(points.length / 2).fill(0).forEach((item, index) => {
      arr.push([points[2 * index] + position.x, points[2 * index + 1] + position.y]);
    });
    console.log(arr);
    // points.forEach((item, index) => arr.push([points[2 * index] + position.x, points[2 * index + 1] + position.y]));
    return arr.every(([x, y]) => verify(x, y, width, height));
  }

  initialUI() {
    super.initialUI();
    if (this.UIInitialed) return;
    const poly = new Polygon({ id: "poly", name: "node-poly" });
    const textfield = new TextField();
    textfield.width(55);
    this.draggable(false);
    this.add(poly, textfield);
    const toolLayer = this.$stage.findOne("#toolsLayer");
    toolLayer.add(this);
    this.draw();
    this.UIInitialed = true;
  }

  _tryUpdateData() {
    if (!this.verifyDataLegal() && this.getStage()) {
      this.getStage().fire(INTERNAL_EVENTS.DATA_REMOVED, { id: this.data.id });
      this.remove();
      return;
    }

    const stage = this.getStage();
    if (!stage) return;

    // const data = this._convertData();
    // stage.fire(INTERNAL_EVENTS.DATA_UPDATED, { id: this.data.id, data });
  }
}

export default RectTool;
