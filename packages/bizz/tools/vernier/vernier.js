import { UIComponent } from "@pkg/tools/src";
import { Circle } from "konva/lib/shapes/Circle";
import { Wedge } from "konva/lib/shapes/Wedge";

class Vernier extends UIComponent {
  constructor(bizzConfig = {}, config = {}) {
    super(config);
    this._currentIndex = -1;
    this._path = [];

    // count: 有几瓣三角形
    // offset: 三角形顶点距离(0,0) 点距离
    const { count = 2, offset = 0 } = bizzConfig;
    const perAngle = ~~(360 / count);
    Array.from({ length: count }).forEach((_, index) => {
      const vernier = new Triangle();
      const r = perAngle * index - 10;
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
      this.draggable(true);
      const anchor = new Circle({
        fill: "rgba(0,0,0,0.1)",
        radius: 7,
        stroke: "red",
        strokeWidth: 0,
      });
      this.add(anchor);
      // this.hitStrokeWidth(20);

      this.on("dragmove", (e) => {
        if (dragMode === 1) {
          this.y(this.originPosition[1]);
        } else if (dragMode === 2) {
          this.x(this.originPosition[0]);
        }

        const { x, y } = this.position();
        const index = this._findNearIndex([x, y]);
        this.currentIndex = index;
      });
    }
  }

  /** 设置路径 */
  set path(arr = []) {
    // TODO: 抽象path 支持centerline2d/3d 格式
    this._path = arr;
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
    this.rotation(angle - 90);
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
    this.rotation(angle - 90);
  }

  /** 设置当前索引。并看向下一个点 */
  set currentIndex(val) {
    this._currentIndex = val;
    const currentPosition = this.path[this.currentIndex];
    this.position({
      x: currentPosition[0],
      y: currentPosition[1],
    });

    this.originPosition = currentPosition;
    this.lookAtNextPoint();
  }

  get currentIndex() {
    return this._currentIndex;
  }

  _calcAngle(p1, p2) {
    const [x1, y1] = p1;
    const [x2, y2] = p2;

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
}

/*************************************************/
/**         internal class                      **/
/*************************************************/

let DEFAULT_CONFIG = {
  fillRadialGradientStartPoint: { x: 0, y: 0 },
  fillRadialGradientStartRadius: 0,
  fillRadialGradientEndPoint: { x: 0, y: 0 },
  fillRadialGradientEndRadius: 15,
  fillRadialGradientColorStops: [0, "#F9A72700", 1, "#F9A727"],
  lineJoin: "round",
  angle: 20,
  radius: 30,
  rotation: -10,
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
