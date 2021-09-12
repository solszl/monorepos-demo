import { Line } from "konva/lib/shapes/Line";
import { verify } from "../../area";
import { INTERNAL_EVENTS, TOOL_CONSTANTS, TOOL_ITEM_SELECTOR, TOOL_TYPE } from "../../constants";
import Anchor from "../../shape/parts/anchor";
import DashLine from "../../shape/parts/dashline";
import TextField from "../../shape/parts/textfield";
import { setActionComplete } from "../../state/tool-state";
import { useViewportState } from "../../state/viewport-state";
import BaseAnnotationTool from "../base/base-annotation-tool";
import { connectTextNode, randomId } from "../utils";
import { worldToLocal } from "../utils/coords-transform";

class AngleTool extends BaseAnnotationTool {
  constructor(config = {}) {
    super(config);
    this.type = TOOL_TYPE.ANGLE;
    const name = randomId();
    this.name(name);
    this._data = {
      id: name,
      type: this.type,
      start: { x: 0, y: 0 },
      middle: { x: 0, y: 0 },
      position: { x: 0, y: 0 },
      end: { x: 0, y: 0 },
      textBox: { dragged: false, x: 0, y: 0, text: "" },
    };

    this.careStageEvent = true;
    this.pointCount = 0;

    setActionComplete(false);
  }

  mouseDown(evt) {
    super.mouseDown(evt);
    if (this.pointCount === 2) {
      return;
    }

    this.initialUI();
    this.data.position = this.$stage.getPointerPosition();
    this.pointCount += 1;
  }

  mouseMove(evt) {
    super.mouseMove(evt);
    if (!this.careStageEvent || this.pointCount === 3 || this.pointCount === 0) {
      return;
    }

    const pointer = this.getRelativePointerPosition();
    switch (this.pointCount) {
      case 1:
        this.data.middle = pointer;
        break;
      case 2:
        this.data.end = pointer;
        this.data.textBox.text = this._getAngle();
        break;
    }

    this.renderData();
  }

  mouseUp(evt) {
    super.mouseUp(evt);

    this.pointCount += 1;
    if (this.pointCount === 3) {
      this.pointCount = 0;
      setActionComplete(true);
      this.careStageEvent = false;
      this._tryUpdateData();
    }
  }

  renderData() {
    super.renderData();
    const { start, end, middle, position, textBox } = this.data;
    this.setPosition(position);
    this.findOne("#anchorStart").setPosition(start);
    this.findOne("#anchorMiddle").setPosition(middle);
    this.findOne("#anchorEnd").setPosition(end);
    this.findOne("#line1").points([start.x, start.y, middle.x, middle.y]);
    this.findOne("#line2").points([middle.x, middle.y, end.x, end.y]);
    const textfield = this.findOne(`.${TOOL_ITEM_SELECTOR.LABEL}`);
    if (!textBox.dragged) {
      const angle = this._getAngle();
      const x = angle <= 180 ? middle.x - 65 : middle.x + 10;
      const align = angle <= 180 ? "right" : "left";
      textfield.align(align);
      textfield.setPosition({ x, y: middle.y });
    } else {
      const from = [
        [start.x, start.y],
        [middle.x, middle.y],
        [end.x, end.y],
      ];
      textfield.setPosition({
        x: textBox.x,
        y: textBox.y,
      });
      const dashLine = this.findOne(`.${TOOL_ITEM_SELECTOR.DASHLINE}`);
      connectTextNode(textfield, from, dashLine);
    }
    textfield.text(this.showAngle(textBox.text));
  }

  initialUI() {
    super.initialUI();
    if (this.UIInitialed) {
      return;
    }
    const anchorStart = new Anchor({ id: "anchorStart" });
    const anchorMiddle = new Anchor({ id: "anchorMiddle" });
    const anchorEnd = new Anchor({ id: "anchorEnd" });

    [anchorStart, anchorMiddle, anchorEnd].forEach((anchor) => {
      anchor.on("dragmove", this.dragAnchor.bind(this));
      anchor.on("dragend", this.dragAnchorEnd.bind(this));
    });

    const line1 = new Line({
      hitStrokeWidth: TOOL_CONSTANTS.HIT_STROKE_WIDTH,
      name: TOOL_ITEM_SELECTOR.ITEM,
      id: "line1",
    });
    const line2 = new Line({
      hitStrokeWidth: TOOL_CONSTANTS.HIT_STROKE_WIDTH,
      name: TOOL_ITEM_SELECTOR.ITEM,
      id: "line2",
    });
    const textfield = new TextField();
    textfield.width(55);
    textfield.on("dragmove", this.dragText.bind(this));
    const dashLine = new DashLine({ visible: false });
    this.draggable(true);
    this.on("dragend", this.dragEnd.bind(this));
    this.add(anchorStart, anchorMiddle, anchorEnd, line1, line2, textfield, dashLine);
    const toolLayer = this.$stage.findOne("#toolsLayer");
    toolLayer.add(this);
    this.draw();
  }

  verifyDataLegal() {
    const { start, end, middle, position } = this.data;
    const [viewportState] = useViewportState(this.$stage.id());
    const { width, height } = viewportState();
    const points = [
      [start.x + position.x, start.y + position.y],
      [middle.x + position.x, middle.y + position.y],
      [end.x + position.x, end.y + position.y],
    ];

    return points.every(([x, y]) => verify(x, y, width, height));
  }

  dragAnchor(evt) {
    // 找到拖拽的，然后设置数据
    super.dragAnchor(evt);
    const anchor = evt.target;
    switch (anchor.getId()) {
      case "anchorStart":
        this.data.start = anchor.getPosition();
        break;
      case "anchorMiddle":
        this.data.middle = anchor.getPosition();
        break;
      case "anchorEnd":
        this.data.end = anchor.getPosition();
        break;
    }
    this.data.textBox.text = this._getAngle();
    this.renderData();
  }

  dragAnchorEnd(evt) {
    super.dragAnchorEnd(evt);
    this._tryUpdateData();
  }

  dragEnd(evt) {
    super.dragEnd(evt);
    this.data.position = this.getPosition();
    this.renderData();
    this._tryUpdateData();
  }

  dragText(evt) {
    super.dragText(evt);
    const textfield = evt.target;
    const position = textfield.getPosition();

    this.data.textBox = Object.assign({}, this.data.textBox, {
      dragged: true,
      x: position.x,
      y: position.y,
    });

    this.renderData();
  }

  showAngle(angle) {
    if (angle === "") {
      return "";
    }
    let res = (angle + 360) % 360;
    if (res > 180) {
      res = 360 - res;
    }
    return `${res.toFixed(1)}°`;
  }

  _getAngle() {
    const { start, end, middle } = this.data;
    const x1 = start.x - middle.x;
    const y1 = start.y - middle.y;
    const x2 = end.x - middle.x;
    const y2 = end.y - middle.y;
    const dot = x1 * x2 + y1 * y2;
    const det = x1 * y2 - y1 * x2;
    const angle = (Math.atan2(det, dot) / Math.PI) * 180;
    return +((angle + 360) % 360).toFixed(1);
  }

  _tryUpdateData() {
    if (!this.verifyDataLegal() && this.getStage()) {
      this.getStage().fire(INTERNAL_EVENTS.DATA_REMOVED, { id: this.data.id });
      this.remove();
      return;
    }

    const stage = this.getStage();
    if (!stage) {
      return;
    }

    const data = this._convertData();
    stage.fire(INTERNAL_EVENTS.DATA_UPDATED, {
      id: this.data.id,
      data,
    });
  }

  _convertData() {
    // 转换成local
    const { start, middle, end, position, textBox } = this.data;
    const localPosition = worldToLocal(position.x, position.y);
    const localStart = worldToLocal(position.x + start.x, position.y + start.y);
    const localMiddle = worldToLocal(position.x + middle.x, position.y + middle.y);
    const localEnd = worldToLocal(position.x + end.x, position.y + end.y);
    const localText = worldToLocal(position.x + textBox.x, position.y + textBox.y);

    const data = JSON.parse(JSON.stringify(this.data));
    data.position = { x: localPosition[0], y: localPosition[1] };
    data.start = {
      x: localStart[0] - localPosition[0],
      y: localStart[1] - localPosition[1],
    };
    data.middle = {
      x: localMiddle[0] - localPosition[0],
      y: localMiddle[1] - localPosition[1],
    };
    data.end = {
      x: localEnd[0] - localPosition[0],
      y: localEnd[1] - localPosition[1],
    };
    data.textBox.x = localText[0] - localPosition[0];
    data.textBox.y = localText[1] - localPosition[1];

    return data;
  }

  set data(val) {
    super.data = val;
    setActionComplete(true);
  }

  get data() {
    return super.data;
  }
}

export default AngleTool;
