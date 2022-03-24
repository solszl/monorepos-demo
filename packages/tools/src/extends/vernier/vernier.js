// import { Group } from "konva/lib/Group";
import { Rect } from "konva/lib/shapes/Rect";
import { Wedge } from "konva/lib/shapes/Wedge";
import UIComponent from "../../shape/parts/ui-component";

class Vernier extends UIComponent {
  constructor(bizzConfig = {}, config = {}) {
    super(config);

    this._currentIndex = 0;
    this._path = [];

    // count: 有几瓣三角形
    // offset: 三角形顶点距离(0,0) 点距离
    const { count = 2, offset = 0 } = bizzConfig;
    const perAngle = ~~(360 / count);
    Array.from({ length: count }).forEach((_, index) => {
      const vernier = new Triangle();
      const r = perAngle * index;
      vernier.rotation(r);
      if (offset !== 0) {
        vernier.position({
          x: Math.cos((r * Math.PI) / 180) * offset,
          y: Math.sin((r * Math.PI) / 180) * offset,
        });
      }
      this.add(vernier);
    });

    // dragMode 0: 不可抓取， 1：锁定Y, 2:锁定X，3：自由抓取
    const { dragMode = 0 } = bizzConfig;

    if (dragMode > 0) {
      this.draggable(dragMode > 0);
      // 用来drag的
      this.add(
        new Rect({
          fill: "rgba(255,0,0,0.01)",
          width: 50,
          height: 20,
          x: -25,
          y: -10,
        })
      );

      this.on("dragmove", (e) => {
        if (dragMode === 1) {
          this.y(this.originPosition[1]);
        } else if (dragMode === 2) {
          this.x(this.originPosition[0]);
        }

        const { x, y } = this.position();
        const index = this._findNearIndex([x, y]);
        this.currentIndex = index;
        this.fire("index_changed", {
          index,
        });
      });
    }
  }

  /** 设置路径 */
  set path(arr = []) {
    // TODO: 抽象path 支持centerline2d/3d 格式
    this._path = arr;
    this._currentIndex = 0;
    // path 经过transform变化后，需要重新定位游标位置以及观看朝向
    this.autofit();
  }

  get path() {
    return this._path;
  }

  /** 看当前索引的下一个点的位置。 如果已经出于最后一个点，看前面那个点 */
  lookAtNextPoint() {
    const nextIndex = Math.min(this.currentIndex + 1, this.path.length);
    if (nextIndex === this.path.length) {
      this.lookAtPreviousPoint();
      return;
    }
    const nextPosition = this.path[nextIndex];
    const currentPosition = this.path[this.currentIndex];
    const angle = this._calcAngle(currentPosition, nextPosition);
    this.rotation(angle - 90 - 8); // 减半个三角形的角度
  }

  /** 看当前索引的上一个点的位置。 如果已经出于第一个点，看后面那个点 */
  lookAtPreviousPoint() {
    const prevIndex = Math.max(0, this.currentIndex - 1);
    if (prevIndex === 0) {
      this.lookAtNextPoint();
      return;
    }

    const prevPosition = this.path[prevIndex];
    const currentPosition = this.path[this.currentIndex];
    const angle = this._calcAngle(currentPosition, prevPosition);
    this.rotation(angle - 90 - 8);
  }

  /** 设置当前索引。并看向下一个点 */
  set currentIndex(val) {
    const currentPosition = this.path[this.currentIndex];
    this.position({
      x: currentPosition[0],
      y: currentPosition[1],
    });

    this.originPosition = currentPosition;
    this.lookAtNextPoint();

    if (this.currentIndex === val) {
      return;
    }
    this._currentIndex = val;

    // 派发事件
    this?.getStage()?.fire("tx_vernier_index_changed", {
      index: this.currentIndex,
      total: this.path.length,
    });
  }

  get currentIndex() {
    return this._currentIndex;
  }

  setCurrentIndex(val) {
    this._currentIndex = val;
    this.autofit();
  }

  get total() {
    return this.path.length;
  }

  autofit() {
    const currentPosition = this.path[this.currentIndex];
    this.position({
      x: currentPosition[0],
      y: currentPosition[1],
    });

    this.originPosition = currentPosition;
    this.lookAtNextPoint();
  }

  _calcAngle(p1, p2) {
    const [x1, y1] = p1;
    const [x2, y2] = p2;
    if (x1 === x2 && y1 === y2) {
      return this.rotation() + 90 + 8;
    }

    const x = x2 - x1;
    const y = y2 - y1;
    const z = Math.sqrt(x * x + y * y);
    return Math.round((Math.asin(y / z) / Math.PI) * 180);
  }

  _findNearIndex(point) {
    let index = -1;
    let distance = Number.MAX_SAFE_INTEGER;

    // 计算两点之间距离，毕达哥拉斯定理
    const dis = (p1, p2) => {
      const [x1, y1] = p1;
      const [x2, y2] = p2;

      const x = x2 - x1;
      const y = y2 - y1;
      return Math.sqrt(x * x + y * y);
    };

    // 遍历找最近的点
    this.path.forEach((p, i) => {
      const calcDis = dis(point, p);
      if (calcDis < distance) {
        index = i;
        distance = calcDis;
      }
    });

    return index;
  }

  setData(data) {}
  renderData() {}
}

/*************************************************/
/**         internal class                      **/
/*************************************************/

let DEFAULT_CONFIG = {
  fillRadialGradientStartPoint: { x: 0, y: 0 },
  fillRadialGradientStartRadius: 5,
  fillRadialGradientEndPoint: { x: 0, y: 0 },
  fillRadialGradientEndRadius: 25,
  fillRadialGradientColorStops: [0, "rgba(249, 167, 39, 0)", 1, "#F9A727"], // konva 底层不支持 #f9a72700 这样的8位颜色值
  lineJoin: "round",
  angle: 16,
  radius: 25,
  rotation: 0,
  shadowColor: "black",
  shadowOffsetX: 2,
  shadowOffsetY: 2,
  shadowBlur: 1,
  shadowOpacity: 0.5,
};
class Triangle extends Wedge {
  constructor(config = {}) {
    super(Object.assign({}, DEFAULT_CONFIG, config));
  }
}

export default Vernier;
