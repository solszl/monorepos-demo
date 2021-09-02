import { TOOL_TYPE } from "@saga/entry";
import { Ellipse } from "konva/lib/shapes/Ellipse";
import { Rect } from "konva/lib/shapes/Rect";
import { Transformer } from "konva/lib/shapes/Transformer";
import { TOOL_ITEM_SELECTOR } from "../../constants";
import Anchor from "../../shape/parts/anchor";
import BaseAnnotationTool from "../base/base-annotation-tool";
import { randomId } from "../utils";
class EllipseTool extends BaseAnnotationTool {
  constructor(config = {}) {
    super(config);
    this.type = TOOL_TYPE.ELLIPSE_ROI;
    const name = randomId();
    this.name(name);
    this._data = {
      id: name,
      type: this.type,
      position: { x: 0, y: 0 },
      start: { x: 0, y: 0 },
      end: { x: 0, y: 0 },
    };
    this.isDown = false;
  }
  mouseDown(e) {
    super.mouseDown(e);
    this.initialUI();
    this.data.position = this.$stage.getPointerPosition();
    this.renderData();
    this.isDown = true;
  }
  mouseMove(e) {
    super.mouseMove(e);
    if (!this.isDown) {
      return;
    }
    this.data.end = this.getRelativePointerPosition();
    this.renderData();
  }
  mouseUp(e) {
    super.mouseUp(e);
    this.isDown = false;
  }
  initialUI() {
    super.initialUI();
    const anchor1 = new Anchor({ id: "startAnchor" });
    const anchor2 = new Anchor({ id: "endAnchor" });
    const rect = new Rect({ id: "rect", name: TOOL_ITEM_SELECTOR.ANCHOR });
    const ellipse = new Ellipse({
      id: "ellipse",
    });
    [anchor1, anchor2].forEach((anchor) => {
      anchor.on("dragmove", this.dragAnchor.bind(this));
      anchor.on("dragend", this.dragAnchorEnd.bind(this));
    });

    rect.stroke("#000");
    rect.opacity(0.5);
    // ellipse.hitStrokeWidth(60);
    ellipse.stroke("#fff");

    this.draggable(true);

    this.add(rect, anchor1, anchor2, ellipse);
    this.$stage.findOne("#toolsLayer").add(this);
    this.draw();
  }

  renderData() {
    super.renderData();
    const { position, start, end } = this.data;
    console.log(start);
    this.setPosition(position);
    this.findOne("#startAnchor").setPosition(start);
    this.findOne("#endAnchor").setPosition(end);
    this.findOne("#rect").setPosition(start);
    this.findOne("#ellipse").setPosition(start);
    this.findOne("#ellipse").offset({
      x: (start.x - end.x) / 2,
      y: (start.y - end.y) / 2,
    });
    const width = Math.abs(end.x - start.x);
    const height = Math.abs(end.y - start.y);
    this.findOne("#ellipse").size({ width, height });
    this.findOne("#rect").size({
      width: end.x - start.x,
      height: end.y - start.y,
    });
  }

  dragAnchor(e) {
    super.dragAnchor(e);
    const anchor = e.target;
    if (anchor.getId() === "startAnchor") {
      this._data.start = anchor.getPosition();
    } else if (anchor.getId() === "endAnchor") {
      this._data.end = anchor.getPosition();
    }
    this.renderData();
  }
  dragAnchorEnd() {}
}

export default EllipseTool;
