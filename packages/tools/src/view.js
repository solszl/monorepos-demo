import { Component } from "@saga/core";
import { Layer } from "konva/lib/Layer";
import { Stage } from "konva/lib/Stage";

class View extends Component {
  constructor(option = {}) {
    super();
    this.stage = new Stage({
      container: option.el,
      width: option.el.clientWidth,
      height: option.el.clientHeight,
    });

    const layer = new Layer();
    this.stage.add(layer);
  }

  resize(width, height) {
    this.stage.setSize({ width, height });
  }
}

export default View;
