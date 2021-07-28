import Volume from "./volume";
import Plane from "./plane";

class ObliqueSampler {
  /**
   * @param { Volume} volume
   * @param { Plane } plane
   * @memberof ObliqueSampler
   */
  constructor(volume, plane) {
    this.volume = volume;
    this.plane = plane;

    /** @type { Array<Array,Array>} */
    this._cubeEdges = this.volume.cubeEdges;
  }

  /** 更新碰撞点数据、找到顶点对应的二维坐标体系 */
  update() {
    this.computeCubePlaneHitPoints();
    this.findVertices2DCoords();
  }

  /** 计算斜切平面与整个体数据碰撞的点。方法为
   * 一个立方体具有12个边，计算12个边与平面相交点，相交存在3种可能
   *  - 无交点，没有碰撞
   *  - 1个交点， 边与平面相交
   *  - 无限多个点， 边线与平面重叠
   */
  computeCubePlaneHitPoints() {
    let hitPoints = [];
    for (i = 0; i < this._cubeEdges.length; i += 1) {
      const [point, pointVector] = this._cubeEdges[i];
      const tempHitPoint = this._getHitPoint(point, pointVector, this.plane);
      if (tempHitPoint && this.volume.isInVolume(tempHitPoint)) {
        // TODO: 检测是否已经存在
      }
    }
  }

  /** 根据查找出的切面点确定二维坐标系 */
  findVertices2DCoords() {}

  /**
   *
   *
   * @param { array<number> } point
   * @param { array<number> } vector
   * @param { Plane } plane
   * @memberof ObliqueSampler
   * @returns { array }
   */
  _getHitPoint(point, vector, plane) {
    return [];
  }
}

export default ObliqueSampler;
