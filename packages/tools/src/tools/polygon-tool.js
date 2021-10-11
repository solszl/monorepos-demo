import { Line } from "konva/lib/shapes/Line";
import simplify from "simplify-js";
import { TOOL_CONSTANTS, TOOL_ITEM_SELECTOR, TOOL_TYPE } from "../constants";
import BaseTool from "./base/base-tool";
import { randomId } from "./utils";

class PolygonTool extends BaseTool {
  constructor(config = {}) {
    config.useDefaultMouseEffect = false;
    super(config);
    this.type = TOOL_TYPE.POLYGON;
    this.name = randomId();
    this._data = {
      id: this.name,
      type: this.type,
      position: { x: 0, y: 0 },
      points: [],
    };
  }

  initialUI() {
    super.initialUI();
    if (this.UIInitialed) {
      return;
    }

    const line = new Line({
      hitStrokeWidth: TOOL_CONSTANTS.HIT_STROKE_WIDTH,
      name: TOOL_ITEM_SELECTOR.ITEM,
      fill: "blue",
      closed: true,
      stroke: "white",
      strokeWidth: 2,
      opacity: 0.2,
      fillAfterStrokeEnabled: false,
    });
    this.add(line);
    const toolLayer = this.$stage.findOne("#toolsLayer");
    toolLayer.add(this);
    this.draw();

    this.UIInitialed = true;
  }

  mouseDown(evt) {
    super.mouseDown(evt);
    this.isPaint = true;
    this.initialUI();
    this.data.position = this.$stage.getPointerPosition();
    this.setAbsolutePosition(this.data.position);
  }

  mouseMove(evt) {
    super.mouseMove(evt);
    if (!this.isPaint) {
      return;
    }

    const pos = this.getRelativePointerPosition();
    this.data.points.push(pos);
    this.renderData();
  }

  mouseUp(evt) {
    super.mouseUp(evt);

    this.isPaint = false;
    this._tryUpdateData();
  }

  mouseRightClick(evt) {
    super.mouseRightClick(evt);
    console.log(evt);
  }

  renderData() {
    super.renderData();
    let { position, points } = this.data;
    this.setPosition(position);
    // console.log("before", points.length);
    points = simplify(points, 0.3, true);
    // console.log("after", points.length);
    let pts = points.map((p) => {
      return [p.x, p.y];
    });
    this.findOne(`.${TOOL_ITEM_SELECTOR.ITEM}`).points(pts.flat());
    this.draw();
  }

  _tryUpdateData() {}
}

export default PolygonTool;
