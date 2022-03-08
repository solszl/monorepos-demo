import { Group } from "konva/lib/Group";
import { Arrow } from "konva/lib/shapes/Arrow";
import { useCursor } from "../utils/cursor";
import Aim from "./aim";
import { COLORS } from "./tag-constants";

class Tag extends Group {
  constructor(config = {}) {
    super(config);

    const arrow = new Arrow({
      points: [-16, 0, -10, 0],
      pointerLength: 6,
      pointerWidth: 4,
      stroke: "gray",
      strokeWidth: 2,
      id: "arrow",
    });
    // 展开
    arrow.on("click", this._onArrowClickHandler.bind(this));
    // 划入的时候，变成小手
    arrow.on("mouseover", () => {
      useCursor(arrow, "pointer");
    });
    // 划出的时候，变成自动
    arrow.on("mouseout mouseleave", () => {
      useCursor(arrow, "auto");
    });
    this.add(arrow);

    // 文案
    const aim = new Aim({ visible: true, id: "aim" });
    this.add(aim);
  }

  _onArrowClickHandler(e) {
    const aim = this.findOne("#aim");
    aim.visible(!aim.visible());

    this.getStage().fire("tx_tag_state_changed", {
      data: this.getData(),
    });
  }

  setData(data) {
    this._data = data;

    // 剪头还得设置颜色。这交互，绝了
    const { level } = data;
    const arrow = this.findOne("#arrow");
    arrow.stroke(COLORS[level]);

    const aim = this.findOne("#aim");
    aim.data = data;
  }

  getData() {
    return this._data;
  }

  setOpen(val) {
    const aim = this.findOne("#aim");
    aim.visible(val);
  }

  renderData() {}

  updateProps(props) {}

  clear() {}
}

export default Tag;
