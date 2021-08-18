import { Component } from "@saga/core";
import { Layer } from "konva/lib/Layer";
import { Stage } from "konva/lib/Stage";

class View extends Component {
  constructor(option = {}) {
    super();
    // 左中右键绑定的工具集, 绑定的是枚举值
    this.bindTools = {
      0: null,
      1: null,
      2: null,
    };

    const stage = new Stage({
      container: option.el,
      width: option.el.clientWidth,
      height: option.el.clientHeight,
    });

    const layer = new Layer();
    stage.add(layer);
  }

  resize(width, height) {
    this.stage.setSize({ width, height });
  }
}

export default View;
