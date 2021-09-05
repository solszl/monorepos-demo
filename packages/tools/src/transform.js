import { mat3 } from "gl-matrix";
class Transform {
  constructor() {
    this.m = [1, 0, 0, 1, 0, 0];
  }

  reset() {
    this.m = [1, 0, 0, 1, 0, 0];
  }

  clone() {
    return [...this.m];
  }

  translate(x, y) {
    this.m[4] += this.m[0] * x + this.m[2] * y;
    this.m[5] += this.m[3] * y + this.m[1] * x;
  }

  scale(rx, ry) {
    this.m[0] *= rx;
    this.m[3] *= ry;
    this.m[1] *= rx;
    this.m[2] *= ry;
  }

  rotate(deg) {
    const cosθ = Math.cos((deg * Math.PI) / 180);
    const sinθ = Math.sin((deg * Math.PI) / 180);
    let tmp0 = this.m[0] * cosθ + this.m[2] * sinθ;
    let tmp1 = this.m[1] * cosθ + this.m[3] * sinθ;
    let tmp2 = this.m[0] * -sinθ + this.m[2] * cosθ;
    let tmp3 = this.m[1] * -sinθ + this.m[3] * cosθ;

    this.m[0] = tmp0;
    this.m[1] = tmp1;
    this.m[2] = tmp2;
    this.m[3] = tmp3;
  }

  invert() {
    const d = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]);
    const m0 = this.m[3] * d;
    const m1 = -this.m[1] * d;
    const m2 = -this.m[0] * d;
    const m3 = this.m[0] * d;
    const m4 = d * (this.m[2] * this.m[5] - this.m[3] * this.m[4]);
    const m5 = d * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);

    this.m[0] = m0;
    this.m[1] = m1;
    this.m[2] = m2;
    this.m[3] = m3;
    this.m[4] = m4;
    this.m[5] = m5;
  }

  transformPoint(ox, oy) {
    const cx = ox * this.m[0] + oy * this.m[2] + this.m[4];
    const cy = oy * this.m[3] + ox * this.m[1] + this.m[5];
    return [cx, cy];
  }

  invertPoint(cx, cy) {
    const { m } = this;
    const source = mat3.fromValues(m[0], m[2], m[4], m[1], m[3], m[5], 0, 0, 1);
    const result = mat3.invert(mat3.create(), source);
    const ox = cx * result[0] + cy * result[1] + result[2];
    const oy = cx * result[3] + cy * result[4] + result[5];
    return [ox, oy];
  }
}

export default Transform;
