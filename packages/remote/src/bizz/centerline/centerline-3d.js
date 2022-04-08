import { vec3 } from "gl-matrix";
class Centerline3DBizz {
  constructor() {
    this.flatPoints = [];
    this.pointCache = new Map();
  }

  /**
   * 数据结构
   * ```js
   *  const obj = {
   *    points: {
   *      vessel1: [[x,y,z],[x,y,z],[x,y,z]],
   *      vessel2: [[x,y,z],[x,y,z],[x,y,z]],
   *      vessel3: [[x,y,z],[x,y,z],[x,y,z]],
   *    },
   *    origin: [x,y,z],
   *    spacing: [spX, spY, spZ]
   *  }
   * ```
   *
   * @param {*} path 中线数据
   * @memberof Centerline3DBizz
   */
  setData(obj) {
    const { points, origin, spacing } = obj;
    this.origin = origin;
    this.spacing = spacing;
    this.points = points;
    this.pointCache.clear();
    // this.origin = [-120.638, -122.074, 218.627];
    let flatPoints = [];
    Object.entries(points).forEach(([, pts]) => {
      flatPoints = flatPoints.concat(pts);
      return flatPoints;
    });

    this.flatPoints = flatPoints;

    // flatPoints.forEach((point) => {
    //   const [, , z] = this._getXYZByPoint(point);
    //   console.log("这根血管经过", z);
    // });
  }

  get total() {
    return this.flatPoints.length;
  }

  /**
   * 根据3D中线中的索引 返回平面上的XYZ坐标点
   *
   * @param { number } index
   * @memberof Centerline3DBizz
   */
  getXYZByIndex(index) {
    const point = this.getIJKByIndex(index);
    const xyz = this._getXYZByPoint(point);
    return xyz;
  }

  /**
   * 根据层面找到对应的物理点, 可能没有，也可能会有多个点
   *
   * @param { number } sliceId
   * @memberof Centerline3DBizz
   * @returns { Array.<number,number,number> | [] } 找到的物理点
   */
  getIJKBySliceId(sliceId) {
    const { flatPoints } = this;
    let result = flatPoints.reduce((prev, curr) => {
      const [, , z] = this._getXYZByPoint(curr);
      if (z === sliceId) {
        prev.push(curr);
      }

      return prev;
    }, []);

    return result;
  }

  /**
   * 根据传进来的物理坐标找到对应最近的层面
   *
   * @param {*} point
   * @memberof Centerline3DBizz
   */
  getSliceIdByIJK(point) {
    const nearestPoint = this.getNearestIJK(point);
    const [, , z] = this._getXYZByPoint(nearestPoint);
    return z;
  }

  /**
   * 根据索引找物理坐标IJK
   *
   * @param {*} index
   * @memberof Centerline3DBizz
   */
  getIJKByIndex(index) {
    const { total, flatPoints } = this;
    if (index > total) {
      index = total - 1;
    }

    if (index < 0) {
      index = 0;
    }

    return flatPoints[index];
  }

  /**
   * 根据传入的IJK 找到在中线数据中最近的那个索引
   *
   * @param {*} point
   * @memberof Centerline3DBizz
   */
  getIndexByIJK(point) {
    const { index: nearestIndex } = this._getNearestPointObj(point);
    return nearestIndex;
  }

  /**
   * 根据物理位置找到对应层面的xyz坐标
   *
   * @param {*} point
   * @memberof Centerline3DBizz
   */
  getXYZByIJK(point) {
    const nearestPoint = this.getNearestIJK(point);
    const xyz = this._getXYZByPoint(nearestPoint);
    return xyz;
  }

  /**
   * 获取分段信息名字 根据传入的物理点
   *
   * @param {*} point
   * @memberof Centerline3DBizz
   */
  getSegmentNameByIJK(point) {
    const nearestIndex = this.getIndexByIJK(point);
    const { points, total } = this;
    let name = "";

    let passedCount = 0;

    const keys = Object.keys(points);
    for (let i = 0; i < keys.length; i += 1) {
      const pts = points[keys[i]];
      const len = pts.length;
      if (nearestIndex >= passedCount && nearestIndex < passedCount + len) {
        name = keys[i];
        break;
      }
      passedCount += len;
    }

    return name;
  }

  /**
   * 根据传入的IJK 找到距离这个IJK最近的IJK
   *
   * @param { array } point
   * @memberof Centerline3DBizz
   */
  getNearestIJK(point) {
    const { point: nearestPoint } = this._getNearestPointObj(point);
    return nearestPoint;
  }

  /**
   *
   *
   * @param {*} sliceIndex 目标层面
   * @param {*} point
   * @param {boolean} [forward=true] 鼠标前滚还是后滚
   * 如： sliceIndex = 10, forward = true, 表示从第九层滚到第十层，此时应该取第十层所有点的最后一个点。
   * 反之forward = false 意味着从第十一层滚回第十层，需要找小于索引的最近的一个点
   * @memberof Centerline3DBizz
   */
  getLinkData(sliceIndex, point, forward = true) {
    // 业务传进来77， 显示78， 要获取77层的数据
    const points = this.getIJKBySliceId(sliceIndex);

    if (points.length === 0) {
      return {
        point: undefined,
        index: -1,
      };
    }
    // 如果没有对应的point，证明从外面进来，如果是forward = true 取目标层面数据集合的第一个，否则取最后一个
    // 如：血管形状是 "M"，forward = true, 那么返回 M 的左上角的点
    // 如：血管形状是 "W"，forward = false, 那么返回 W 的右下角的点
    if (!point) {
      if (points.length === 0) {
        // 没有交集对应的点的话。返回默认空数据
        return {
          point: undefined,
          index: -1,
        };
      }

      point = forward ? points.shift() : points.pop();
    }

    const currentIndex = this.getIndexByIJK(point);
    let targetIndex = forward ? currentIndex : -1;
    points.forEach((point) => {
      const index = this.getIndexByIJK(point);
      if (forward) {
        // 取距离currentIndex 最远的那个index
        if (index > currentIndex) {
          targetIndex = index;
        }
      } else {
        // 取距离currentIndex 最近的 前面的那个index
        if (index < currentIndex && index > targetIndex) {
          targetIndex = index;
        }
      }
    });

    if (targetIndex !== -1) {
      const targetPoint = this.getIJKByIndex(targetIndex);
      return {
        point: targetPoint,
        index: targetIndex,
      };
    }

    return {
      point: undefined,
      index: -1,
    };
  }

  _getNearestPointObj(point) {
    const { flatPoints } = this;
    let distance = Number.MAX_SAFE_INTEGER;
    let index = -1;
    let nearestPoint = null;

    flatPoints.forEach((p, i) => {
      let d = vec3.distance(p, point);
      if (d < distance) {
        distance = d;
        index = i;
        nearestPoint = p;
      }
    });

    return {
      point: nearestPoint,
      index,
      distance,
    };
  }

  _getXYZByPoint(point) {
    if (this.pointCache.has(point)) {
      return this.pointCache.get(point);
    }

    const { origin, spacing } = this;
    // xyz = [x,y,z] = (point - origin) / spacing
    const xyz = vec3.round(
      [],
      vec3.divide(
        [],
        vec3.subtract([], point, origin).map((i) => Math.abs(i)),
        spacing
      )
    );
    this.pointCache.set(point, xyz);
    return xyz;
  }
}

export default Centerline3DBizz;
