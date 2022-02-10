import { Group } from "konva/lib/Group";
import { Ellipse } from "konva/lib/shapes/Ellipse";
import { Rect } from "konva/lib/shapes/Rect";
import { INTERNAL_EVENTS, TOOL_COLORS, TOOL_ITEM_SELECTOR, TOOL_TYPE } from "../../constants";
import { roi } from "../../misc/roi";
import Anchor from "../../shape/parts/anchor";
import DashLine from "../../shape/parts/dashline";
import TextItem from "../../shape/parts/text-item";
import { useViewportState } from "../../state/viewport-state";
import BaseAnnotationTool from "../base/base-annotation-tool";
import { connectTextNode, randomId, toCT } from "../utils";
import { cursor } from "../utils/index";
const MeasureUnit = {
  dicom: "mm",
  webImage: "px",
};

const PRECISION = 0.1;
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
      textBox: {
        dragged: false,
        x: 0,
        y: 0,
        area: 0,
        variance: 0,
        avg: 0,
        min: 0,
        max: 0,
        suffix: "mm",
      },
    };

    this.isDown = false;
  }
  mouseDown(e) {
    super.mouseDown(e);

    this.initialUI();
    this.data.position = this.$stage.getPointerPosition();
    this._updateTextBox();
    this.isDown = true;
  }
  mouseMove(e) {
    super.mouseMove(e);
    if (!this.isDown) {
      return;
    }
    this.data.end = this.getRelativePointerPosition();
    this._updateTextBox();
    this.renderData();
  }
  mouseUp(e) {
    super.mouseUp(e);
    this.isDown = false;
    // 验证数据合法。派发事件，添加数据。 否则丢弃
    this._tryUpdateData();
  }
  initialUI() {
    super.initialUI();
    const anchor1 = new Anchor({ id: "startAnchor" });
    const anchor2 = new Anchor({ id: "endAnchor" });
    const rect = new Rect({
      id: "rect",
      name: TOOL_ITEM_SELECTOR.ANCHOR,
      stroke: "#000",
      opacity: 0,
    });
    const ellipse = new Ellipse({
      id: "ellipse",
      hitStrokeWidth: 60,
      stroke: "#FFF",
      name: TOOL_ITEM_SELECTOR.ITEM,
      stroke: TOOL_COLORS.NORMAL[`.${TOOL_ITEM_SELECTOR.ITEM}`],
    });
    [anchor1, anchor2].forEach((anchor) => {
      anchor.on("dragmove", this.dragAnchor.bind(this));
      anchor.on("dragend", this.dragAnchorEnd.bind(this));
    });

    const group = new Group({
      id: "textGroup",
      draggable: true,
      width: 170,
      height: 100,
    });
    group.on("dragmove", this.dragText.bind(this));
    const ti1 = new TextItem({ id: "area" });
    const ti2 = new TextItem({ id: "variance", y: 20 });
    const ti3 = new TextItem({ id: "avg", y: 40 });
    const ti4 = new TextItem({ id: "max", y: 60 });
    const ti5 = new TextItem({ id: "min", y: 80 });
    group.add(ti1, ti2, ti3, ti4, ti5);

    const dashline = new DashLine({ visible: false });

    this.draggable(true);

    this.on("dragmove", this.dragMove.bind(this));
    this.on("dragend", this.dragEnd.bind(this));

    this.add(rect, anchor1, anchor2, ellipse, group, dashline);
    this.$stage.findOne("#toolsLayer").add(this);
    this.draw();
  }

  renderData() {
    super.renderData();
    const { position, start, end } = this.data;
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

    const { areaText, varianceText, avgText, maxText, minText } = this.globalConfig["ellipse_roi"];
    const group = this.findOne("#textGroup");
    const { textBox: data } = this.data;
    const toFixed = (value, len = 2) => {
      if (isNaN(+value)) {
        return "";
      }

      return +(+value).toFixed(len);
    };
    group.findOne("#area")?.setText(`${areaText}：`, `${toFixed(data.area)}${data.suffix}²`);
    group.findOne("#variance")?.setText(`${varianceText}：`, toFixed(data.variance));
    group.findOne("#avg")?.setText(`${avgText}：`, toFixed(data.avg));
    group.findOne("#max")?.setText(`${maxText}：`, toFixed(data.max));
    group.findOne("#min")?.setText(`${minText}：`, toFixed(data.min));

    if (data.dragged) {
      const dashline = this.findOne(`.${TOOL_ITEM_SELECTOR.DASHLINE}`);
      const from = [
        [(start.x + end.x) / 2, start.y],
        [end.x, (start.y + end.y) / 2],
        [(start.x + end.x) / 2, end.y],
        [start.x, (start.y + end.y) / 2],
      ];

      group.setPosition({ x: data.x, y: data.y });
      connectTextNode(group, from, dashline);
    } else {
      const x = Math.max(start.x, end.x);
      const y = Math.min(start.y, end.y);
      group.setPosition({ x: x + 10, y });
    }
  }

  dragMove() {
    this.data.position = this.getPosition();
    this._updateTextBox();
    this.renderData();
  }

  dragEnd(e) {
    super.dragEnd(e);
    this._tryUpdateData();
  }

  dragAnchor(e) {
    super.dragAnchor(e);
    const anchor = e.target;
    if (anchor.getId() === "startAnchor") {
      this._data.start = anchor.getPosition();
    } else if (anchor.getId() === "endAnchor") {
      this._data.end = anchor.getPosition();
    }

    this._updateTextBox();
    this.renderData();
  }

  dragAnchorEnd(e) {
    super.dragAnchorEnd(e);
    this._tryUpdateData();
  }

  dragText(evt) {
    super.dragText(evt);
    const group = evt.target;

    this.data.textBox = Object.assign(
      {},
      this.data.textBox,
      {
        dragged: true,
      },
      group.position()
    );
    this.renderData();
  }

  verifyDataLegal() {
    const { start, end, position } = this.data;
    const [viewportState] = useViewportState(this.$stage.id());
    const { width, height } = viewportState();
    const points = [
      [start.x + position.x, start.y + position.y],
      [end.x + position.x, end.y + position.y],
    ];

    if (
      Math.abs(points[0][0] - points[1][0]) <= PRECISION ||
      Math.abs(points[0][1] - points[1][1]) <= PRECISION
    ) {
      return false;
    }

    return points.every(([x, y]) => this.verify(x, y, width, height));
  }

  _tryUpdateData() {
    if (!this.verifyDataLegal() && this.getStage()) {
      cursor(this.getStage(), "auto");
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
    const { position, end, start, textBox } = this.data;
    const { $transform: transform } = this;
    const localPosition = transform.invertPoint(position.x, position.y);
    const localStart = transform.invertPoint(position.x + start.x, position.y + start.y);
    const localEnd = transform.invertPoint(position.x + end.x, position.y + end.y);
    const localText = transform.invertPoint(position.x + textBox.x, position.y + textBox.y);

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

  _getArea() {
    const { $transform: transform } = this;
    // 计算面积
    const { position, start, end } = this.data;
    const { columnPixelSpacing = 0.625, rowPixelSpacing = 0.625 } = this.imageState;
    const localStart = transform.invertPoint(position.x + start.x, position.y + start.y);
    const localEnd = transform.invertPoint(position.x + end.x, position.y + end.y);
    const a = Math.abs(localStart[0] - localEnd[0]) / 2;
    const b = Math.abs(localStart[1] - localEnd[1]) / 2;
    const area = Math.PI * (a * columnPixelSpacing) * (b * rowPixelSpacing);
    return area;
  }

  _getPixelData() {
    const { $transform: transform } = this;
    // 思路：根据绘制椭圆外层的矩形宽高、起始点，循环获取pixelData值，判断当前pixelData是否在椭圆中，在则取出。
    const { position, start, end } = this.data;
    const pixelData = this.imageState.pixelData;
    const localStart = transform.invertPoint(position.x + start.x, position.y + start.y);
    const localEnd = transform.invertPoint(position.x + end.x, position.y + end.y);
    // 锚点绘制椭圆时，外层矩形的宽高
    const width = Math.abs(localStart[0] - localEnd[0]);
    const height = Math.abs(localStart[1] - localEnd[1]);
    // 外层矩形左上角的起始点
    const x = Math.round(Math.min(localStart[0], localEnd[0]));
    const y = Math.round(Math.min(localStart[1], localEnd[1]));
    // 椭圆长轴宽轴
    const a = Math.abs(localStart[0] - localEnd[0]) / 2;
    const b = Math.abs(localStart[1] - localEnd[1]) / 2;
    // 椭圆中心点
    const center = [(localStart[0] + localEnd[0]) / 2, (localStart[1] + localEnd[1]) / 2];

    let ellipsePixelData = [];
    let index = 0;
    for (let row = 0; row < height; row++) {
      for (let column = 0; column < width; column++) {
        if (this._inEllipse(a, b, column + x, row + y, center)) {
          const pixelDataIndex = (row + y) * this.imageState.columns + (column + x);
          ellipsePixelData[index++] = pixelData[pixelDataIndex];
        }
      }
    }

    return toCT(ellipsePixelData, this.imageState.slope, this.imageState.intercept);
  }

  _getInfo(pixelData) {
    let sum = 0; // 总数
    let s = 0;
    let min = Number.MAX_SAFE_INTEGER;
    let max = Number.MIN_SAFE_INTEGER;

    for (let i = 0; i < pixelData.length; i++) {
      const item = pixelData[i];
      sum += item;
      min = Math.min(min, item);
      max = Math.max(max, item);
    }
    const avg = sum / pixelData.length; // 平均数

    // (x1 - M)^2 + (x2 - M)^2 + ...... +(xn - M)^2
    for (let i = 0; i < pixelData.length; i++) {
      const item = pixelData[i];
      s += Math.pow(item - avg, 2);
    }
    const variance = Math.sqrt(s / pixelData.length); // 方差

    return { variance, max, min, area: this._getArea(), avg };
  }

  _inEllipse(a, b, x, y, center) {
    return (
      Math.pow(x - center[0], 2) / Math.pow(a, 2) + Math.pow(y - center[1], 2) / Math.pow(b, 2) <= 1
    );
  }

  _updateTextBox() {
    this.data.textBox.suffix = MeasureUnit[this.imageState.imageType] ?? "mm";

    const { start, end, position } = this.data;
    const { $transform: transform } = this;

    const localPosition = transform.invertPoint(position.x, position.y);
    const localStart = transform.invertPoint(position.x + start.x, position.y + start.y);
    const localEnd = transform.invertPoint(position.x + end.x, position.y + end.y);

    const result = roi(this.imageState, {
      position: { x: localPosition[0], y: localPosition[1] },
      start: {
        x: localStart[0] - localPosition[0],
        y: localStart[1] - localPosition[1],
      },
      end: {
        x: localEnd[0] - localPosition[0],
        y: localEnd[1] - localPosition[1],
      },
    });
    this.data.textBox = Object.assign({}, this.data.textBox, result);
  }
}

export default EllipseTool;
