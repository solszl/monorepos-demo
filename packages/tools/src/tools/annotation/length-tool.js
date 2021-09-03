import BaseAnnotationTool from "../base/base-annotation-tool";
import { TOOL_CONSTANTS, TOOL_ITEM_SELECTOR, TOOL_TYPE, INTERNAL_EVENTS } from "../../constants";
import Anchor from "../../shape/parts/anchor";
import { Line } from "konva/lib/shapes/Line";
import TextField from "../../shape/parts/textfield";
import DashLine from "../../shape/parts/dashline";
import { connectTextNode, randomId } from "../utils";
import { verify } from "../../area";
import { worldToLocal } from "../utils/coords-transform";

class LengthTool extends BaseAnnotationTool {
  constructor(config = {}) {
    super(config);
    this.type = TOOL_TYPE.LENGTH;
    const name = randomId();
    this.name(name);
    this._data = {
      id: name,
      type: this.type,
      position: { x: 0, y: 0 },
      start: { x: 0, y: 0 },
      end: { x: 0, y: 0 },
      textBox: { dragged: false, x: 0, y: 0, text: "" },
    };
    this.careStageEvent = true;
  }

  mouseDown(evt) {
    super.mouseDown(evt);
    this.initialUI();
    this.data.position = this.$stage.getPointerPosition();
  }

  mouseMove(evt) {
    super.mouseMove(evt);
    if (!this.careStageEvent) {
      return;
    }

    const pointer = this.getRelativePointerPosition();
    this.data.end = pointer;

    this._calcText();
    this.renderData();
  }

  mouseUp(evt) {
    super.mouseUp(evt);
    this.careStageEvent = false;
    // 验证数据合法。派发事件，添加数据。 否则丢弃
    this._tryUpdateData();
  }

  verifyDataLegal() {
    const { start, end, position } = this.data;
    const points = [
      [start.x + position.x, start.y + position.y],
      [end.x + position.x, end.y + position.y],
    ];

    return points.every(([x, y]) => verify(x, y));
  }

  renderData() {
    super.renderData();
    const { position, start, end, textBox } = this.data;
    this.setPosition(position);
    this.findOne("#startAnchor")?.setPosition(start);
    this.findOne("#endAnchor")?.setPosition(end);
    this.findOne(`.${TOOL_ITEM_SELECTOR.ITEM}`)?.points([start.x, start.y, end.x, end.y]);

    const textfield = this.findOne(`.${TOOL_ITEM_SELECTOR.LABEL}`);
    if (!textBox.dragged) {
      const usePosition = end.x - start.x > 0 ? end : start;
      textfield.setPosition({ x: usePosition.x + 10, y: usePosition.y });
    } else {
      const from = [
        [start.x, start.y],
        [end.x, end.y],
        [(start.x + end.x) / 2, (start.y + end.y) / 2],
      ];

      textfield.setPosition({
        x: textBox.x,
        y: textBox.y,
      });

      const dashLine = this.findOne(`.${TOOL_ITEM_SELECTOR.DASHLINE}`);
      connectTextNode(textfield, from, dashLine);
    }

    textfield.text(textBox.text);
  }

  initialUI() {
    super.initialUI();
    if (this.UIInitialed) {
      return;
    }
    // 需要2个锚点，一个线，一个文案，可能还需要一个虚线
    const anchor1 = new Anchor({
      id: "startAnchor",
    });
    const anchor2 = new Anchor({
      id: "endAnchor",
    });
    [anchor1, anchor2].forEach((anchor) => {
      anchor.on("dragmove", this.dragAnchor.bind(this));
      anchor.on("dragend", this.dragAnchorEnd.bind(this));
    });

    const line = new Line({
      hitStrokeWidth: TOOL_CONSTANTS.HIT_STROKE_WIDTH,
      name: TOOL_ITEM_SELECTOR.ITEM,
    });

    const textfield = new TextField();
    textfield.on("dragmove", this.dragText.bind(this));
    const dashLine = new DashLine({ visible: false });

    this.draggable(true);
    this.on("dragend", this.dragEnd.bind(this));

    this.add(anchor1, anchor2, line, textfield, dashLine);
    const toolLayer = this.$stage.findOne("#toolsLayer");
    toolLayer.add(this);
    this.draw();

    this.UIInitialed = true;
  }

  dragAnchor(evt) {
    // 找到拖拽的，然后设置数据
    super.dragAnchor(evt);
    const anchor = evt.target;
    if (anchor.getId() === "startAnchor") {
      this._data.start = anchor.getPosition();
    } else if (anchor.getId() === "endAnchor") {
      this._data.end = anchor.getPosition();
    }

    this._calcText();
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

    this.data.textBox = Object.assign(
      {},
      this.data.textBox,
      {
        dragged: true,
      },
      textfield.getPosition()
    );

    this.renderData();
  }

  _calcText() {
    const { start, end } = this.data;
    const distance = +Math.sqrt((start.x - end.x) ** 2 + (start.y - end.y) ** 2).toFixed(2);
    this.data.textBox.text = distance;
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
    const { position, end, textBox, start } = this.data;
    const localPosition = worldToLocal(position.x, position.y);
    const localStart = worldToLocal(position.x + start.x, position.y + start.y);
    const localEnd = worldToLocal(position.x + end.x, position.y + end.y);
    const localText = worldToLocal(position.x + textBox.x, position.y + textBox.y);
    const data = JSON.parse(JSON.stringify(this.data));
    data.position = { x: localPosition[0], y: localPosition[1] };
    data.start = {
      x: localStart[0] - localPosition[0],
      y: localStart[1] - localPosition[1],
    };
    data.end = {
      x: localEnd[0] - localPosition[0],
      y: localEnd[1] - localPosition[1],
    };
    data.textBox.x = localText[0] - localPosition[0];
    data.textBox.y = localText[1] - localPosition[1];
    return data;
  }
}

export default LengthTool;
