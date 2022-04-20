import { Group } from "konva/lib/Group";
import { Line } from "konva/lib/shapes/Line";
import { Text } from "konva/lib/shapes/Text";
import { useViewportState } from "../../state/viewport-state";

class Segment extends Group {
  constructor(config = {}) {
    super(config);
    this.id("segment");

    this.keymap = null;
  }

  /**
   *
   * @param { string } val 方向， 'landscape' | 'portrait'
   */
  setDirection(val) {
    this.direction = val;
    const rotateAngle = val === "landscape" ? 0 : 90;
    this.rotation(rotateAngle);

    const { m } = this.$transform;
    const w = m.at(4);
    const h = m.at(5);
    const [getViewportState] = useViewportState(this.getStage().id());
    const { width, height, scale } = getViewportState();
    val === "landscape"
      ? this.position({ x: w, y: height * scale + m[5] - this.height() }) // 图像缩放后的高度+偏移-文本的高度
      : this.position({ x: w + this.height(), y: h });
  }

  setData(val) {
    this.removeChildren();
    const { data, direction, size, keymap } = val;
    this.width(size);

    this.keymap = keymap;
    this.data = data;
    this.autofit();
    // [{label, points}, {label, points}]
    this.setDirection(direction);
  }

  renderData() {}

  autofit() {
    const { direction, data } = this;
    const stage = this.getStage();
    if (!stage) {
      return;
    }

    const [getViewportState] = useViewportState(this.getStage().id());
    const { width, height, scale } = getViewportState();

    if (direction === "landscape") {
      this.width(width * scale);
    } else {
      this.width(height * scale);
    }

    let total = data.reduce((prev, current) => {
      return prev + (Object.entries(current)[0][1].length ?? 0);
    }, 0);

    let lastX = 0;
    let lastWidth = 0;
    this.removeChildren();
    data.forEach((d) => {
      const seg = new SubSegment();
      this.add(seg);
      const [label, points] = Object.entries(d)[0];
      const length = points.length;
      seg.width((length / total) * this.width());
      seg.setText(this.keymap?.[label] ?? label ?? "");

      seg.x(lastX + lastWidth);
      this.height(seg.height());
      lastX = seg.x();
      lastWidth = seg.width();
    });

    this.setDirection(direction);
  }

  updateProps(props) {
    const { keymap } = props;
    if (keymap) {
      this.keymap = keymap;
      const { children } = this;
      children.forEach((child) => {
        const label = child.getText();
        const replaceLabel = keymap[label] ?? "";
        child.setText(replaceLabel);
      });
    }
  }
}

class SubSegment extends Group {
  constructor(config = {}) {
    super(config);
    const lineProp = {
      points: [0, 0, 0, 12],
      stroke: "gray",
      strokeWidth: 1,
      lineCap: "round",
      lineJoin: "round",
    };
    const line1 = new Line(
      Object.assign(lineProp, {
        id: "line1",
      })
    );
    const line2 = new Line(
      Object.assign(lineProp, {
        id: "line2",
      })
    );

    const textField = new Text({
      id: "textField",
      fontSize: 12,
      align: "center",
      verticalAlign: "bottom",
      fill: "#ffffff",
      stroke: "#afb2c4",
      strokeWidth: 0.2,
      shadowColor: "rgba(0,0,0,0.6)",
      shadowBlur: 0,
      shadowOffsetX: 1,
      shadowOpacity: 1,
      ellipsis: true,
      wrap: "none",
      height: 12,
    });

    this.add(line1);
    this.add(line2);
    this.add(textField);
  }

  setText(val) {
    const [getViewportState] = useViewportState(this.getStage().id());
    const { scale = 3 } = getViewportState();
    // 设置文案
    const textField = this.findOne("#textField");
    textField.text(val);

    textField.fontSize(Math.min(scale * 6, 12));
    // textField.y(this.height() - textField.height());
    // 设置宽度， 存在文案宽度大于容器宽度。此时限定文案宽度。 使其出现'...'
    textField.width(this.width());

    // 设置右边标尺的线的位置
    const line2 = this.findOne("#line2");
    line2.points([0, 0, 0, textField.fontSize()]);
    line2.x(this.width());

    const line1 = this.findOne("#line1");
    line1.points([0, 0, 0, textField.fontSize()]);

    this.height(textField.height());
  }

  getText() {
    const textField = this.findOne("#textField");
    return textField?.text() ?? "";
  }

  updateUI() {}
}

export default Segment;
