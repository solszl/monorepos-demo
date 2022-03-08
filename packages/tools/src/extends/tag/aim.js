import { Group } from "konva/lib/Group";
import { Line } from "konva/lib/shapes/Line";
// import { Arrow } from "konva/lib/shapes/Arrow";
import { Rect } from "konva/lib/shapes/Rect";
import { Text } from "konva/lib/shapes/Text";
import { COLORS } from "./tag-constants";

class Aim extends Group {
  constructor(config = {}) {
    super(config);
    const line = new Line({
      stroke: "#27b2d3",
      strokeWidth: 2,
      lineCap: "round",
      lineJoin: "round",
      points: [-50, 0, -16, 0],
      id: "line",
    });

    const text = new Text({
      text: "",
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
    this.add(line);
    this.add(rectBg);
    this.add(text);
    this._data = null;
  }

  set data(val) {
    this._data = val;

    const { text: label, level } = val;
    const text = this.findOne("#text");
    text.text(label);
    text.x(-text.width() - 55);
    text.y(-text.height() / 2);

    const bg = this.findOne("#bg");
    bg.x(-text.width() - 55);
    bg.y(-text.height() / 2);
    bg.width(text.width());
    bg.fill(COLORS[level]);

    const line = this.findOne("#line");
    line.stroke(COLORS[level]);
  }

  get data() {
    return this._data;
  }
}

export default Aim;
