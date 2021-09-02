import { TOOL_TYPE } from "@saga/entry";
import { Circle } from "konva/lib/shapes/Circle";
import { imageState } from "../state/image-state";
import { viewportState } from "../state/viewport-state";
import BaseTool from "./base/base-tool";
import { cursor, randomId } from "./utils";
import { worldToLocal } from "./utils/coords-transform";

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
      originalRadius: 50, // 原始图像放大半径
      scale: 3, // 放大倍数
      centerPoint: { x: 0, y: 0 }, // 放大镜中心点
      size: 250,
    };
  }

  mouseDown(e) {
    super.mouseDown(e);
    this.initialUI();
    this.findOne("#circle").visible(true);
    this.findOne("#circleBG").visible(true);
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

  renderData() {
    super.renderData();
    const { centerPoint, originalRadius, scale } = this.data;
    const circleBG = this.findOne("#circleBG");
    const circle = this.findOne("#circle");

    circle.setPosition(centerPoint);
    circle.width(this.data.size);
    circle.height(this.data.size);

    circle.fillPatternImage(this._getImage());
    circle.fillPatternOffset({
      x: tmpCanvas.width / 2,
      y: tmpCanvas.height / 2,
    });

    circleBG.setPosition(centerPoint);
    circleBG.width(this.data.size);
    circleBG.height(this.data.size);
  }

  initialUI() {
    super.initialUI();
    const circle = new Circle({
      id: "circle",
      stroke: "#fff",
      strokeWidth: 2,
      radius: 70,
      visible: false,
      fillPatternRepeat: "no-repeat",
    });

    const circle2 = new Circle({
      id: "circleBG",
      fill: "black",
      radius: 70,
      visible: false,
    });

    this.add(circle2, circle);
    const toolLayer = this.$stage.findOne("#toolsLayer");
    toolLayer.add(this);
    this.draw();
  }

  _getImage() {
    const canvas = tmpCanvas;
    tmpCanvas.width = this.data.size * 2;
    tmpCanvas.height = this.data.size * 2;
    const ctx = canvas.getContext("2d");
    const point = worldToLocal(
      this.data.centerPoint.x,
      this.data.centerPoint.y
    );

    ctx.drawImage(
      imageState.imgCanvas,
      point[0] - this.data.originalRadius / viewportState.scale,
      point[1] - this.data.originalRadius / viewportState.scale,
      (this.data.originalRadius * 2) / viewportState.scale,
      (this.data.originalRadius * 2) / viewportState.scale,
      0,
      0,
      tmpCanvas.width,
      tmpCanvas.height
    );
    return canvas;
  }
}

export default MagnifyTool;
