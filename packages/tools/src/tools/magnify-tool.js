import { TOOL_TYPE } from "@saga/entry";
import { Circle } from "konva/lib/shapes/Circle";
import { imageState } from "../state/image-state";
import { viewportState } from "../state/viewport-state";
import BaseTool from "./base/base-tool";
import { randomId } from "./utils";
import { worldToLocal } from "./utils/coords-transform";

class MagnifyTool extends BaseTool {
  constructor(config = {}) {
    super(config);
    this.type = TOOL_TYPE.MAGNIFYING;
    this.dom = null;
    const name = randomId();
    this.name(name);
    this._data = {
      id: name,
      type: this.type,
      originalRadius: 50, // 原始图像放大半径
      scale: 3, // 放大倍数
      centerPoint: { x: 0, y: 0 }, // 放大镜中心点
    };
  }

  mouseDown(e) {
    super.mouseDown(e);
    this.initialUI();
    this.findOne("#circle").visible(true);
    this.findOne("#circleBG").visible(true);
    this.data.centerPoint = this.$stage.getRelativePointerPosition();
    this.renderData();
  }

  mouseMove(e) {
    super.mouseMove(e);
    this.data.centerPoint = this.$stage.getRelativePointerPosition();
    this.renderData();
  }

  mouseUp(e) {
    super.mouseUp(e);
    this.remove();
  }

  renderData() {
    super.renderData();
    const { centerPoint, originalRadius, scale } = this.data;
    const circleBG = this.findOne("#circleBG");
    const circle = this.findOne("#circle");

    circle.setPosition(centerPoint);
    circle.width(originalRadius * scale * viewportState.scale);
    circle.height(originalRadius * scale * viewportState.scale);
    circle.fillPatternImage(this._getImage());
    circle.fillPatternOffset({
      x: originalRadius * scale * viewportState.scale,
      y: originalRadius * scale * viewportState.scale,
    });

    circleBG.setPosition(centerPoint);
    circleBG.width(originalRadius * scale * viewportState.scale);
    circleBG.height(originalRadius * scale * viewportState.scale);
  }

  initialUI() {
    super.initialUI();
    const circle = new Circle({
      id: "circle",
      stroke: "#fff",
      strokeWidth: 2,
      radius: 70,
      visible: false,
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
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const { width, height } = imageState.canvas;
    const point = worldToLocal(
      this.data.centerPoint.x,
      this.data.centerPoint.y
    );
    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(
      imageState.imgCanvas,
      point[0] - this.data.originalRadius,
      point[1] - this.data.originalRadius,
      imageState.canvas.width,
      imageState.canvas.height,
      0,
      0,
      imageState.canvas.width * viewportState.scale * this.data.scale,
      imageState.canvas.height * viewportState.scale * this.data.scale
    );
    return canvas;
  }
}

export default MagnifyTool;
