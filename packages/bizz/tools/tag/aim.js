import { Group } from "konva/lib/Group";
import { Arrow } from "konva/lib/shapes/Arrow";
import { Rect } from "konva/lib/shapes/Rect";
import { Text } from "konva/lib/shapes/Text";

const COLORS = {
  0: "rgba(69,69,69,1)",
  1: "rgba(42, 199, 246,1)",
  2: "rgba(0, 131, 244,1)",
  3: "rgba(249, 167, 39,1)",
  4: "rgba(255, 89, 89,1)",
  5: "rgba(196, 0, 0,1)",
};
class Aim extends Group {
  constructor(config = {}) {
    super(config);
    const arrow = new Arrow({
      points: [-50, 0, -10, 0],
      pointerLength: 4,
      pointerWidth: 4,
      stroke: "pink",
      strokeWidth: 2,
      id: "arrow",
    });

    const text = new Text({
      text: "LM 轻微狭窄",
      fontSize: 12,
      fontFamily: "Calibri",
      fill: "white",
      padding: 6,
      align: "center",
      id: "text",
    });

    const rectBg = new Rect({
      fill: "#ddd",
      height: text.height(),
      shadowColor: "black",
      shadowBlur: 10,
      shadowOffsetX: 10,
      shadowOffsetY: 10,
      shadowOpacity: 0.2,
      cornerRadius: 4,
      id: "bg",
    });
    this.add(arrow);
    this.add(rectBg);
    this.add(text);
    this._data = null;
    this.data = "aaa";
  }

  set data(val) {
    this._data = val;
    const text = this.findOne("#text");
    text.text("LM 轻微狭窄");
    text.x(-text.width() - 55);
    text.y(-text.height() / 2);

    const bg = this.findOne("#bg");
    bg.x(-text.width() - 55);
    bg.y(-text.height() / 2);
    bg.width(text.width());
    bg.fill(COLORS[3]);

    const arrow = this.findOne("#arrow");
    arrow.stroke(COLORS[3]);
  }

  get data() {
    return this._data;
  }
}

export default Aim;
