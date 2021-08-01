import { Component } from "@saga/core";
import { Stage } from "konva/lib/Stage";

class View extends Component {
  constructor() {
    super();
    this.stage = new Stage({});
  }

  resize(w, h) {}
}

export default View;
