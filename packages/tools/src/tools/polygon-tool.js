import { Image } from "konva/lib/shapes/Image";
import { TOOL_ITEM_SELECTOR, TOOL_TYPE } from "../constants";
import BaseTool from "./base/base-tool";
import { randomId } from "./utils";

class PolygonTool extends BaseTool {
  constructor(config = {}) {
    config.useDefaultMouseEffect = false;
    super(config);
    this.type = TOOL_TYPE.POLYGON;
    this.name(randomId());
    this._data = {
      id: this.name,
      type: this.type,
      position: { x: 0, y: 0 },
      points: [],
    };

    this._canvas = document.createElement("canvas");
  }

  initialUI() {
    super.initialUI();
    if (this.UIInitialed) {
      return;
    }

    const img = new Image({
      name: TOOL_ITEM_SELECTOR.ITEM,
      image: this.getCanvas(),
      draggable: false,
    });
    this.add(img);

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
    let { position, points, useCustomColourConfig, colour } = this.data;
    this.setPosition(position);
    // console.log("before", points.length);
    // points = simplify(points, 0.3, true);
    // console.log("after", points.length);
    // this.findOne(`.${TOOL_ITEM_SELECTOR.ITEM}`).points(pts.flat(Infinity));

    const ctx = this.getContext();
    if (useCustomColourConfig) {
      ctx.fillStyle = colour.fillColor;
      ctx.strokeStyle = colour.lineColor;
      ctx.strokeWidth = colour.lineWidth;
    }

    ctx.beginPath();
    // 通常是一维的
    points.map((point) => {
      point.map((pt, index) => {
        if (index === 0) {
          ctx.moveTo(pt[0], pt[1]);
        }

        ctx.lineTo(pt[0], pt[1]);
      });
    });
    ctx.stroke();
    ctx.closePath();
    ctx.fill("evenodd");
    this.draw();
  }

  _tryUpdateData() {}

  getCanvas() {
    this._canvas.width = 512;
    this._canvas.height = 512;
    return this._canvas;
  }

  getContext() {
    const ctx = this._canvas.getContext("2d");
    return ctx;
  }
}

export default PolygonTool;
