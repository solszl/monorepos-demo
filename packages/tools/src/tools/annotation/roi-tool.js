import { Ellipse } from "konva/lib/shapes/Ellipse";
import { INTERNAL_EVENTS, TOOL_COLORS, TOOL_ITEM_SELECTOR, TOOL_TYPE } from "../../constants";
import TextField from "../../shape/parts/textfield";
import BaseAnnotationTool from "../base/base-annotation-tool";
import { randomId } from "../utils";

const ROI_CONFIG = {
  1: "#E02020",
  2: "#F7B500",
  3: "#6DD400",
  4: "#0091FF",
  5: "#6236FF",
};

class RoiTool extends BaseAnnotationTool {
  constructor(config = {}) {
    super(Object.assign({}, config, { useDefaultMouseEffect: false, draggable: false }));
    this.type = TOOL_TYPE.ROI;
    const name = randomId();
    this.name(name);

    this._data = {
      id: name,
      type: this.type,
      position: { x: 0, y: 0 },
      start: { x: 0, y: 0 },
      end: { x: 0, y: 0 },
      index: window.roiIndex ?? 1,
      useCustomColourConfig: true,
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
    // 验证数据合法。派发事件，添加数据。 否则丢弃
    this._tryUpdateData();
  }

  mouseRightClick(e) {
    super.mouseRightClick(e);
    console.log("hello world");
  }

  initialUI() {
    super.initialUI();
    const { index } = this.data;
    const color = ROI_CONFIG[index];
    const ellipse = new Ellipse({
      id: "ellipse",
      stroke: "#FFF",
      name: TOOL_ITEM_SELECTOR.ITEM,
      stroke: color ?? TOOL_COLORS.NORMAL[`.${TOOL_ITEM_SELECTOR.ITEM}`],
    });

    const textfield = new TextField({ id: "textfield", fontColor: color });
    textfield.setPosition({ x: 20, y: 10 });
    textfield.draggable(false);
    textfield.show();

    this.add(ellipse, textfield);
    this.$stage.findOne("#toolsLayer").add(this);
    this.draw();
  }

  renderData() {
    super.renderData();
    const { position, start, end, index } = this.data;

    this.setPosition(position);
    this.findOne("#ellipse").setPosition(start);
    this.findOne("#ellipse").offset({
      x: (start.x - end.x) / 2,
      y: (start.y - end.y) / 2,
    });
    const width = Math.abs(end.x - start.x);
    const height = Math.abs(end.y - start.y);

    const textfield = this.findOne("#textfield");
    textfield.text(index);
    textfield.setPosition({
      x: Math.max(start.x, end.x) + 10,
      y: (start.y + end.y) >> 1,
    });
    this.findOne("#ellipse").size({ width, height });
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

  verifyDataLegal() {
    const { start, end, position } = this.data;
    const { width, height } = this.viewportState;
    const points = [
      [start.x + position.x, start.y + position.y],
      [end.x + position.x, end.y + position.y],
    ];

    if (points[0][0] === points[1][0] && points[0][1] === points[1][1]) {
      return false;
    }
    return points.every(([x, y]) => this.verify(x, y, width, height));
  }

  _convertData() {
    const { $transform: transform } = this;
    const { position, start, end } = this.data;

    const localPosition = transform.invertPoint(position.x, position.y);
    const localStart = transform.invertPoint(position.x + start.x, position.y + start.y);
    const localEnd = transform.invertPoint(position.x + end.x, position.y + end.y);

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
    return data;
  }
}

export default RoiTool;
