import { vec3 } from "gl-matrix";
class Plane {
  constructor() {
    // 平面方程 ax + by + cz + d = 0
    this._a = null;
    this._b = null;
    this._c = null;
    this._d = null;

    this._n = null; // 平面上法向量
    this._u = null; // 平面内的一个任意向量
    this._v = null; // 平面内的另一个向量，该向量正交于_u 向量
    this._p = null; // 当平面由一个点和一个法向量定义时，就是这个点
  }

  /**
   * 根据P、Q、R 三个点初始化一个平面，每个点都是长度为3的数组。
   *
   * @param { Array } P
   * @param { Array } Q
   * @param { Array } R
   * @memberof Plane
   */
  makeFrom3Points(P, Q, R) {
    // from https://keisan.casio.com/exec/system/1223596129
    // P -> Q vector
    let vPQ = [Q[0] - P[0], Q[1] - P[1], Q[2] - P[2]];
    // P -> R vector
    let vPR = [R[0] - P[0], R[1] - P[1], R[2] - P[2]];

    // 求法向量
    this._n = vec3.create();
    vec3.normalize(this._n, vec3.cross(this._n, vPQ, vPR));
    this._a = this._n[0];
    this._b = this._n[1];
    this._c = this._n[2];
    this._d = -1 * (this._a * P[0] + this._b * P[1] + this._c * P[2]);

    this._defineUVFrom2Points(P, Q);
  }

  makeFromEquation(a, b, c, d) {
    this._a = a;
    this._b = b;
    this._c = c;
    this._d = d;
  }

  /**
   * 根据一个点和一个向量初始化一个平面方程
   *
   * @param { Array } point
   * @param { Array } vector
   * @memberof Plane
   */
  makeFrom1Point1Vector(point, vector) {
    this._p = point;
    this._n = vector;
    this._a = vector[0];
    this._b = vector[1];
    this._c = vector[2];
    this._d = -1 * (this._a * point[0] + this._b * point[1] + this._c * point[2]);

    let point2 = null;
    // 在平面上找另一个点
    if (this._c !== 0) {
      let x2 = point[0];
      let y2 = point[1] - 1;
      let z2 = -1 * ((this._a * x2 + this._b * y2 + this._d) / this._c);
      point2 = [x2, y2, z2];
    }

    if (this._b !== 0 && !point2) {
      let x2 = point2[0];
      let z2 = point2[2] + 1;
      let y2 = -1 * ((this._a * x2 + this._c * z2 + this._d) / this._b);
      point2 = [x2, y2, z2];
    }

    if (this._c !== 0 && !point2) {
      let y2 = point2[1];
      let z2 = point2[2] + 1;
      let x2 = -1 * ((this._b * y2 + this._c * z2 + this._d) / this._a);
      point2 = [x2, y2, z2];
    }

    this._defineUVFrom2Points(point2, point2);
  }

  getEquation() {
    return [this._a, this._b, this._c, this._d];
  }

  copy(otherPlane) {
    // 数值类型的
    this._a = otherPlane._a;
    this._b = otherPlane._b;
    this._c = otherPlane._c;
    this._d = otherPlane._d;

    // 数组类型的
    this._n = otherPlane._n.slice();
    this._u = otherPlane._u.slice();
    this._v = otherPlane._v.slice();
    this._p = otherPlane._p.slice();
  }

  _defineUVFrom2Points(P, Q) {
    this._u = vec3.create();
    vec3.normalize(this._u, vec3.sub(this._u, Q, P));

    this._v = vec3.create();
    vec3.normalize(this._v, vec3.cross(this._v, this._u, this._n));
  }

  getPoint() {
    return this._p.slice();
  }

  getNVector() {
    return this._n.slice();
  }

  getUVector() {
    return this._u.slice();
  }

  getVVector() {
    return this._v.slice();
  }

  buildOrthoU(plane) {
    this.makeFrom1Point1Vector(plane.getPoint(), plane.getUVector());
  }

  buildOrthoV(plane) {
    this.makeFrom1Point1Vector(plane.getPoint(), plane.getVVector());
  }
}

export default Plane;
