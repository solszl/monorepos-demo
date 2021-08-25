import BaseAnnotationTool from "../base/base-annotation-tool";
import {
  EVENTS,
  TOOL_CONSTANTS,
  TOOL_ITEM_SELECTOR,
  TOOL_TYPE,
} from "../../constants";
import { Line } from "konva/lib/shapes/Line";
import Anchor from "../../shape/parts/anchor";
import TextField from "../../shape/parts/textfield";
import { randomId } from "../utils";
import { verify } from "../../area";
import { setActionComplete } from "../../tool-state";

class AngleTool extends BaseAnnotationTool {
  constructor(config = {}) {
    super(config);
    this._data = {
      id: randomId(),
      start: { x: 0, y: 0 },
      middle: { x: 0, y: 0 },
      position: { x: 0, y: 0 },
      end: { x: 0, y: 0 },
      textBox: { dragged: false, x: 0, y: 0, text: "" },
    };

    setActionComplete(false);
  }

  mouseDown(evt) {
    super.mouseDown(evt);
    this.initialUI();
    this.data.position = this.$stage.getPointerPosition();
  }

  mouseMove(evt) {
    super.mouseMove(evt);
    console.log("mouseMove");
    const pointer = this.getRelativePointerPosition();
    if (!(this.data.end.x && this.data.end.y)) {
      this.data.end = pointer;
    } else {
      this.data.middle = pointer;
    }

    this.renderData();
  }

  mouseUp(evt) {
    super.mouseUp(evt);
    // if (!(this.data.end.x && this.data.end.y)) {
    // }
    // this._tryDrapData();
  }

  renderData() {
    super.renderData();
    const { start, end, middle, position } = this.data;
    this.setPosition(position);
    this.findOne("#anchorStart").setPosition(start);
    this.findOne("#anchorMiddle").setPosition(middle);
    this.findOne("#anchorEnd").setPosition(end);
    this.findOne("#line1").points([start.x, start.y, middle.x, middle.y]);

    // console.log(this._getAngle());
  }

  initialUI() {
    super.initialUI();
    const anchorStart = new Anchor({ id: "anchorStart" });
    const anchorMiddle = new Anchor({ id: "anchorMiddle" });
    const anchorEnd = new Anchor({ id: "anchorEnd" });
    const line1 = new Line({
      hitStrokeWidth: TOOL_CONSTANTS.HIT_STROKE_WIDTH,
      name: "node-item",
      id: "line1",
    });
    const line2 = new Line({
      hitStrokeWidth: TOOL_CONSTANTS.HIT_STROKE_WIDTH,
      name: "node-item",
      id: "line2",
    });
    const textfield = new TextField();

    this.draggable(true);
    this.add(anchorStart, anchorMiddle, anchorEnd, line1, line2, textfield);
    const toolLayer = this.$stage.findOne("#toolsLayer");
    toolLayer.add(this);
    this.draw();
  }

  _tryDrapData() {
    if (!this.verifyDataLegal() && this.getStage()) {
      this.getStage().fire(EVENTS.DATA_REMOVED, { id: this.data.id });
      this.remove();
    }
  }

  verifyDataLegal() {
    // TODO: 数据合法性验证
    const { start, end, middle } = this.data;
    const points = [
      [start.x, start.y],
      [middle.x, middle.y],
    ];

    // const points = [
    //   [start.x + position.x, start.y + position.y],
    //   [end.x + position.x, end.y + position.y],
    // ];

    return points.every(([x, y]) => verify(x, y));
    // return true;
  }

  _getAngle() {
    const { start, end, middle, position } = this.data;
    const x1 = middle.x - start.x;
    const y1 = middle.y - start.y;
    const x2 = end.x - middle.x;
    const y2 = end.y - middle.y;
    const dot = x1 * x2 + y1 * y2;
    const det = x1 * y1 - y1 * x2;
    const angle = (Math.atan2(det, dot) / Math.PI) * 180;
    return (angle + 360) % 360;
  }
}

export default AngleTool;
