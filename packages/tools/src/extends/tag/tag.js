import { Group } from "konva/lib/Group";
import { Circle } from "konva/lib/shapes/Circle";
import { useCursor } from "../utils/cursor";
import Aim from "./aim";

class Tag extends Group {
  constructor(config = {}) {
    super(config);

    const circle = new Circle({
      fill: "rgba(0,0,0,0.1)",
      stroke: "#FFFFFFFF",
      strokeWidth: 2,
      radius: 6,
      hitStrokeWidth: 10,
      draggable: false,
    });
    circle.on("click", this._onCircleClickHandler.bind(this));
    circle.on("mouseover", () => {
      useCursor(circle, "pointer");
    });
    circle.on("mouseout mouseleave", () => {
      useCursor(circle, "auto");
    });
    this.add(circle);

    const aim = new Aim({ visible: true, id: "aim" });
    this.add(aim);
  }

  _onCircleClickHandler(e) {
    const aim = this.findOne("#aim");
    aim.visible(!aim.visible());

    console.log(aim.data);
  }

  setData(data) {
    this._data = data;
    const aim = this.findOne("#aim");
    aim.data = data;
  }

  getData() {
    return this._data;
  }

  renderData() {}

  updateProps(props) {}

  clear() {}
}

export default Tag;
