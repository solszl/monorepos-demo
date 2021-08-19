import { Component } from "@saga/core";
import { Layer } from "konva/lib/Layer";
import { Stage } from "konva/lib/Stage";
import ToolState from "./tool-state";
import MouseTrap from "./trap/mouse-trap";

class View extends Component {
  constructor(option = {}) {
    super(option);

    this.toolState = new ToolState();

    const stage = new Stage({
      container: option.el,
      width: option.el.clientWidth,
      height: option.el.clientHeight,
    });
    this.stage = stage;

    const layer = new Layer();
    stage.add(layer);
    const layer1 = new Layer();
    stage.add(layer1);
    const layer2 = new Layer();
    stage.add(layer2);
    const layer3 = new Layer();
    stage.add(layer3);
  }

  resize(width, height) {
    this.stage.setSize({ width, height });
  }

  useTool(toolType, button = 0) {
    this.toolState.updateState(toolType, button);
    MouseTrap.enable(this.stage);
  }
}

export default View;
