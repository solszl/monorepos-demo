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
    val === "landscape" ? this.position({ x: w, y: h }) : this.position({ x: w + 13, y: h });
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
      const [label, points] = Object.entries(d)[0];
      const length = points.length;
      seg.width((length / total) * this.width());
      seg.setText(this.keymap?.[label] ?? label ?? "");

      seg.x(lastX + lastWidth);
      lastX = seg.x();
      lastWidth = seg.width();

      this.add(seg);
    });

    this.setDirection(direction);
  }

  updateProps(props) {
    console.log("segment", props);
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
      points: [0, 0, 0, 11],
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
      fill: "gray",
      ellipsis: true,
      wrap: "none",
    });

    this.add(line1);
    this.add(line2);
    // this.add(line3);
    this.add(textField);
  }

  setText(val) {
    // 设置文案
    const textField = this.findOne("#textField");
    textField.text(val);

    // 设置宽度， 存在文案宽度大于容器宽度。此时限定文案宽度。 使其出现'...'
    textField.width(this.width());

    // 设置右边标尺的线的位置
    const line2 = this.findOne("#line2");
    line2.x(this.width());
  }

  getText() {
    const textField = this.findOne("#textField");
    return textField?.text() ?? "";
  }

  updateUI() {}
}

export default Segment;
