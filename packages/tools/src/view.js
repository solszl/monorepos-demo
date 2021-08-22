import { Component } from "@saga/core";
import { Layer } from "konva/lib/Layer";
import { Stage } from "konva/lib/Stage";
import ToolState from "./tool-state";
import MouseTrap from "./trap/mouse-trap";

class View extends Component {
  constructor(option = {}) {
    super(option);

    this.toolState = new ToolState();
    this.initContainer(option.el);
  }

  resize(width, height) {
    this.stage.setSize({ width, height });
  }

  useTool(toolType, button = 0) {
    this.toolState.updateState(toolType, button);
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

    const layer = new Layer();
    stage.add(layer);
  }
}

export default View;
