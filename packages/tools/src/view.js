import { Component } from "@saga/core";
import { Layer } from "konva/lib/Layer";
import { Stage } from "konva/lib/Stage";
import ToolState from "./tool-state";
import MouseTrap from "./trap/mouse-trap";
import { INTERNAL_EVENTS } from "./constants";
import Area from "./area";

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

    stage.on(INTERNAL_EVENTS.DATA_CREATED, (e) => {
      console.log(e);
    });

    stage.on(INTERNAL_EVENTS.DATA_UPDATED, (e) => {});

    stage.on(INTERNAL_EVENTS.DATA_REMOVED, (e) => {});
  }

  updateViewport(config = {}) {
    this.area.update(config);
  }
}

export default View;
