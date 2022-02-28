import { Group } from "konva/lib/Group";
import { Line } from "konva/lib/shapes/Line";
import { Text } from "konva/lib/shapes/Text";

class Segment extends Group {
  constructor(config = {}) {
    super(config);
  }

  /**
   *
   * @param { string } val 方向， 'landscape' | 'portrait'
   */
  setDirection(val) {
    const rotateAngle = val === "landscape" ? 0 : 90;
    this.rotate(rotateAngle);
    // 偏移lineHeight
    const offsetX = rotateAngle === 0 ? 0 : 13;
    this.x(offsetX);
  }

  setData(val) {
    this.removeChildren();
    // [{label, points}, {label, points}]
    let total = val.reduce((prev, current) => {
      return prev + (current.points.length ?? 0);
    }, 0);

    let lastX = 0;
    let lastWidth = 0;
    val.forEach((data) => {
      const seg = new SubSegment();
      const { label, points } = data;
      seg.width((points.length / total) * this.width());
      seg.setText(label);

      seg.x(lastX + lastWidth);
      lastX = seg.x();
      lastWidth = seg.width();

      this.add(seg);
    });
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
    const line3 = new Line(
      Object.assign(lineProp, {
        id: "line3",
      })
    );

    const textField = new Text({
      id: "textField",
      fontSize: 12,
      align: "center",
      verticalAlign: "bottom",
      fill: "white",
      ellipsis: true,
      wrap: "none",
    });

    this.add(line1);
    this.add(line2);
    this.add(line3);
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
    // 设置底部线
    const line3 = this.findOne("#line3");
    line3.points([0, textField.height() + 1, this.width(), textField.height() + 1]);
  }

  updateUI() {}
}

export default Segment;
