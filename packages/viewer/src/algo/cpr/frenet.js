import { CurveInterpolator } from "curve-interpolator";
import { vec3 } from "gl-matrix";

class Frenet {
  constructor() {}

  /**
   *
   *
   * @param { Array<number,number,number> } points
   * @param {number} [step=0.5]
   * @param {string} [interpolation="catmull-rom"]
   * @memberof Frenet
   */
  calcFrenet(points, step = 0.5, interpolation = "catmull-rom") {
    this.originPoints = points;
    let clonedPoints = [...points];
    let interpolatedPoints;
    switch (interpolation) {
      case "catmull-rom":
        const interpolator = new CurveInterpolator(clonedPoints, { tension: 0 });
        const segmentCount = interpolator.length / step;
        interpolatedPoints = interpolator.getPoints(segmentCount);
        break;
      case "none":
        interpolatedPoints = clonedPoints;
        break;
      default:
        interpolatedPoints = clonedPoints;
        break;
    }

    const len = interpolatedPoints;
    // 切线向量集合 normalize(vector1 - vector0)
    const TS = new Array(len);
    // 法线向量集合 normalize(vectorTS1 - vectorTS0)
    const NS = new Array(len);
    // 副法向量集合 normalize(cross(T0, N0))
    const BS = new Array(len);

    // http://www.unchainedgeometry.com/jbloom/pdf/ref-frames.pdf
    // Although this method produces correct results for T1 = T0, it is subject to other degeneracies
    // remove points[0]
    const newPoints = interpolatedPoints.slice(1).concat(interpolatedPoints.slice(-1));

    for (let i = 0; i < newPoints.length; i++) {
      TS[i] = [];
      vec3.sub(TS[i], newPoints[i], points[i]);
      vec3.normalize(TS[i], TS[i]);
    }

    let T = TS[0];
    NS[0] = vec3.normalize([], vec3.sub([], TS[1], TS[0]));
    this.n0 = NS[0];
    let N = NS[0];
    BS[0] = vec3.normalize([], vec3.cross([], T, N));
    let B = BS[0];

    for (let i = 0; i < TS.length; i++) {
      T = TS[i];
      N = vec3.normalize([], vec3.cross([], B, T));
      B = vec3.normalize([], vec3.cross([], T, N));
      NS[i] = N;
      BS[i] = B;
    }

    // 最后一个点都是[0,0,0], 用倒数第二个替代一下
    TS[len - 1] = TS[len - 2];
    NS[len - 1] = NS[len - 2];
    BS[len - 1] = BS[len - 2];

    return {
      originPoints: this.originPoints,
      points: interpolatedPoints,
      tangents: TS,
      normals: NS,
      binormals: BS,
    };
  }
}

export default Frenet;
