import { Component } from "@saga/core";
import { Layer } from "konva/lib/Layer";
import { Stage } from "konva/lib/Stage";
import ToolState from "./tool-state";
import MouseTrap from "./trap/mouse-trap";
import { INTERNAL_EVENTS, TOOL_CONSTRUCTOR } from "./constants";
import Area from "./area";
import { transform as transformCoords } from "./tools/utils/coords-transform";

class View extends Component {
  constructor(option = {}) {
    super(option);

    this.toolState = new ToolState();
    this.area = new Area();
    this.initContainer(option.el);
  }

  resize(width, height) {
    this.stage.setSize({ width, height });
  }

  useTool(toolType, button = 1) {
    this.toolState.updateState(toolType, button, this.stage);
    MouseTrap.enable(this.stage, this.toolState);
  }

  initContainer(el) {
    const toolContainer = document.createElement("div");
    toolContainer.classList.add("tools-container");
    toolContainer.style.cssText = `position: absolute;top: 0;left: 0;width: 100%;height: 100%;border: 0; z-index:2;`;
    el.appendChild(toolContainer);

    const stage = new Stage({
      container: toolContainer,
      width: toolContainer.clientWidth,
      height: toolContainer.clientHeight,
    });
    this.stage = stage;

    stage.add(
      new Layer({
        id: "toolsLayer",
      })
    );

    // 整理事件监听
    Object.values(INTERNAL_EVENTS).forEach((eventName) => {
      stage.on(eventName, (info) => {
        this.emit(eventName, info);
      });
    });
  }

  updateViewport(config = {}) {
    this.area.update(config);
  }

  /**
   * 设置工具层数据
   *
   * @param { array } data
   * @memberof View
   */
  renderData(data = new Map()) {
    const layer = this.stage.findOne("#toolsLayer");
    if (!layer) {
      console.error(`can't find tools layer.`);
    }

    layer.removeChildren();
    data.forEach((obj) => {
      const { type } = obj;
      const item = new TOOL_CONSTRUCTOR[type]();
      item.data = item.convertLocalCoords(obj);
      layer.add(item);
    });
  }

  resetData(data = new Map()) {
    const layer = this.stage.findOne("#toolsLayer");
    if (!layer) {
      console.error(`can't find tools layer.`);
    }
    data.forEach((obj) => {
      const item = layer.findOne(`.${obj.id}`);
      const data = transformCoords(obj);
      item.setData(data);
      item.renderData();
    });
    layer.batchDraw();
  }
}

export default View;
