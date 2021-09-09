import { Component } from "@saga/core";
import { DD } from "konva/lib/DragAndDrop";
import { Layer } from "konva/lib/Layer";
import { Stage } from "konva/lib/Stage";
import Area from "./area";
import { INTERNAL_EVENTS } from "./constants";
import { TOOL_CONSTRUCTOR } from "./constructor";
import { imageState } from "./state/image-state";
import ToolState from "./state/tool-state";
import { transform as transformCoords } from "./tools/utils/coords-transform";
import MouseTrap from "./trap/mouse-trap";

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

    const stage = new Stage(
      Object.assign(
        {},
        {
          container: toolContainer,
          id: this.id,
        },
        this._getRootSize(el)
      )
    );
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

  updateImageState(config = {}) {
    Object.keys(config).map((key) => {
      imageState[key] = config[key];
    });
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

    // 如果有正在拖拽的， 就先取消拖拽，再清空当前layer
    DD?._dragElements.clear();
    layer.removeChildren();
    data.forEach((obj) => {
      const { type, id } = obj;
      const item = new TOOL_CONSTRUCTOR[type]();
      item.$stage = layer.getStage();
      item.data = transformCoords(obj);
      item.name(id);
    });
    layer.batchDraw();
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

  _getRootSize(el) {
    let { clientWidth, clientHeight } = el;
    return { width: clientWidth, height: clientHeight };
  }
}

export default View;
