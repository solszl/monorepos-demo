import Konva from "konva";
import { Circle } from "konva/lib/shapes/Circle";
import { Rect } from "konva/lib/shapes/Rect";
import { TOOL_TYPE } from "..";
import BaseTool from "./base/base-tool";
import { cursor, randomId } from "./utils";

const tmpCanvas = document.createElement("canvas");
class MagnifyTool extends BaseTool {
  constructor(config = {}) {
    super(Object.assign({}, config, { useDefaultMouseEffect: false }));
    this.type = TOOL_TYPE.MAGNIFYING;
    this.dom = null;
    this.name = randomId();
    this._data = {
      id: this.name,
      type: this.type,
      originalDiameter: 50, // 原始图像放大半径
      centerPoint: { x: 0, y: 0 }, // 放大镜中心点
      size: 250,
    };
  }

  mouseDown(e) {
    super.mouseDown(e);

    this.initialUI();
    this.findOne("#magnify").visible(true);
    this.findOne("#magnifyBG").visible(true);
    this.data.centerPoint = this.$stage.getRelativePointerPosition();
    cursor(this, "none");
    this.renderData();
  }

  mouseMove(e) {
    super.mouseMove(e);
    this.data.centerPoint = this.$stage.getRelativePointerPosition();
    this.renderData();
  }

  mouseUp(e) {
    super.mouseUp(e);
    cursor(this, "auto");
    this.remove();
  }

  mouseLeave(e) {
    super.mouseLeave(e);
    cursor(this, "auto");
    this.remove();
  }

  mouseOut(e) {
    super.mouseOut(e);
    cursor(this, "auto");
    this.remove();
  }

  renderData() {
    super.renderData();
    const { centerPoint } = this.data;
    const { mode } = this.globalConfig["magnify"];

    const magnifyBG = this.findOne("#magnifyBG");
    const magnify = this.findOne("#magnify");

    magnify.width(this.data.size);
    magnify.height(this.data.size);

    magnify.fillPatternImage(this._getImage());

    magnifyBG.width(this.data.size);
    magnifyBG.height(this.data.size);

    if (mode === "square") {
      magnify.setPosition({
        x: centerPoint.x - 125,
        y: centerPoint.y - 125,
      });
      magnify.fillPatternOffset({
        x: 0,
        y: 0,
      });
      magnifyBG.setPosition({
        x: centerPoint.x - 125,
        y: centerPoint.y - 125,
      });
    } else if (mode === "circle") {
      magnify.fillPatternOffset({
        x: tmpCanvas.width / 4,
        y: tmpCanvas.height / 4,
      });
      magnify.setPosition(centerPoint);
      magnifyBG.setPosition(centerPoint);
    } else {
    }
  }

  initialUI() {
    super.initialUI();

    const { mode } = this.globalConfig["magnify"];

    if (mode === "square") {
      const square = new Konva.Rect({
        id: "magnify",
        stroke: "#fff",
        strokeWidth: 2,
        visible: false,
        fillPatternRepeat: "no-repeat",
      });

      const square2 = new Rect({
        id: "magnifyBG",
        fill: "black",
        visible: false,
      });
      this.add(square2, square);
    } else if (mode === "circle") {
      const circle = new Circle({
        id: "magnify",
        stroke: "#fff",
        strokeWidth: 2,
        radius: 70,
        visible: false,
        fillPatternRepeat: "no-repeat",
      });

      const circle2 = new Circle({
        id: "magnifyBG",
        fill: "black",
        radius: 70,
        visible: false,
      });

      this.add(circle2, circle);
    }
    const toolLayer = this.$stage.findOne("#toolsLayer");
    toolLayer.add(this);
    this.draw();
  }

  _getImage() {
    const canvas = tmpCanvas;
    const { mode } = this.globalConfig["magnify"];
    // const ratio = mode === "square" ? 1 : 2;
    const ratio = mode === "square" ? 1 : 2;
    tmpCanvas.width = this.data.size * ratio;
    tmpCanvas.height = this.data.size * ratio;
    const ctx = canvas.getContext("2d");
    const { $transform: transform } = this;
    const point = transform.invertPoint(this.data.centerPoint.x, this.data.centerPoint.y);

    ctx.drawImage(
      this.imageState.imgCanvas,
      point[0] - this.data.originalDiameter / 2 / this.viewportState.scale, // 算偏移x
      point[1] - this.data.originalDiameter / 2 / this.viewportState.scale, // 算偏移y
      (this.data.originalDiameter * ratio) / this.viewportState.scale,
      (this.data.originalDiameter * ratio) / this.viewportState.scale,
      0,
      0,
      tmpCanvas.width,
      tmpCanvas.height
    );

    return canvas;
  }
}

export default MagnifyTool;
