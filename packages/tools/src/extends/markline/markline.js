import { Group } from "konva/lib/Group";
import { Line } from "konva/lib/shapes/Line";
import Anchor from "./anchor";
import { interpolation } from "./markline-logic";

let DEFAULT_CONFIG = {
  stroke: "#27b2d3",
  strokeWidth: 2,
  lineCap: "round",
  lineJoin: "round",
};

/**
 * 编辑中线的UI展示
 *
 * @class MarkLine
 * @extends {Group}
 */
class MarkLine extends Group {
  constructor(config = {}) {
    super(Object.assign({}, config, { id: "markline" }));

    /** 2个控制点之间存在多少个控制点 */
    this.gap = 9;
    /** 舍弃开头多少个点 */
    this.offset = 0;
  }

  setData(data) {
    this.removeChildren();
    const { path, offset, gap } = data;

    let line = new Line(Object.assign({}, DEFAULT_CONFIG, { id: "line" }));
    this.add(line);
    line.points(path.flat(10));

    this.path = path;
    if (offset !== undefined) {
      this.offset = offset;
    }

    if (gap !== undefined) {
      this.gap = gap;
    }

    // 循环添加N个锚点，根据gap和offset设置其显隐状态
    path.reduce((prevPoint, currentPoint, index) => {
      const anchor = new Anchor({
        name: "anchor",
        position: { x: currentPoint[0], y: currentPoint[1] },
      });
      this.add(anchor);
      anchor.setIndex(index);
      anchor.addEventListener("anchor_drag_move", (e) => {
        const { target } = e;
        this._updatePath(target);
      });

      anchor.addEventListener("anchor_drag_end", (e) => {
        console.log("end", e);
      });
      prevPoint = currentPoint;
      return prevPoint;
    }, path[0]);

    this.autofit();
  }

  autofit() {
    // 控制样式开关等
    const { gap, offset, path } = this;
    const anchors = this.find(".anchor");
    anchors.forEach((anchor, i) => {
      const index = anchor.getIndex();
      if (index < offset) {
        anchor.setOpen(false);
        return;
      }

      anchor.setOpen((index - offset) % gap === 0);
      const pos = path[i];
      if (pos) {
        anchor.position({ x: pos[0], y: pos[1] });
      }
    });
  }

  updateProps(props) {
    // 更新间距
    const { gap } = props;
    if (gap !== undefined) {
      this.gap = Math.max(1, gap);
    }

    // 更新偏移
    const { offset } = props;
    if (offset !== undefined) {
      this.offset = Math.max(0, offset);
    }

    this.autofit();
  }

  /**
   *  根据拖拽的锚点重新计算点路径
   *  如原始点
   *  点A ---- 点B ---- 点C ---- 点D ----点E ---- 点F
   *
   *  拖拽成下图的样子后。
   *  点A ---- 点B ---- 点C              点E ---- 点F
   *                       |---- 点D----|
   *
   *  1. 根据 点C 到 点D 进行重新数据插值。 得到结果m
   *  2. 根据 点D 到 点E 进行重新数据插值。 得到结果n
   *  3. 将m,n 合并 [...m,...n]
   *  4. 替换原path中相对应的索引关系数据
   */
  _updatePath(anchor) {
    const { gap } = this;
    const currentIndex = anchor.getIndex();
    const { x: x0, y: y0 } = anchor.position();
    const position = [x0, y0];

    const anchors = this.find(".anchor");
    const prevIndex = Math.max(0, currentIndex - gap);
    const prevAnchor = anchors.find((anchor) => anchor.getIndex() === prevIndex);
    const { x: x1, y: y1 } = prevAnchor.position();
    const prevPosition = [x1, y1];

    const nextIndex = Math.min(currentIndex + gap, anchors.length);
    const nextAnchor = anchors.find((anchor) => anchor.getIndex() === nextIndex);
    const { x: x2, y: y2 } = nextAnchor.position();
    const nextPosition = [x2, y2];

    let i1 = interpolation(prevPosition, position, gap);
    let i2 = interpolation(position, nextPosition, gap);

    // i2 的第一个点是重复点
    if (i2.length > 0) {
      i2.shift();
    }

    const i3 = i1.concat(i2);

    this.path.splice(prevIndex, i3.length, ...i3);
    const line = this.findOne("#line");
    line.points(this.path.flat(10));
  }
}

export default MarkLine;
