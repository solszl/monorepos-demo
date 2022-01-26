import { CurveInterpolator } from "curve-interpolator";
import { mat4, vec3 } from "gl-matrix";
import { getDefaultHu, getHu } from "../utils";
import Sampler from "./sampler";

class StretchedSampler extends Sampler {
  constructor(options = {}) {
    super(options);
    this._phi = 0;
  }

  prepareForGenerate() {
    this._calcNormalVector();
    this._calcImageSize();
  }

  generate() {
    super.generate();
    const { width, height, Ys } = this;
    const interpolator = new CurveInterpolator(Ys, { tension: 0 });
    const c1 = interpolator.getPoints(height);

    const { lps2ijk } = this;
    const m = mat4.clone(lps2ijk);

    const {
      specVector,
      spacing: [spX],
      ratio,
    } = this;

    let a = [0, 0, 0, 1];
    let U = vec3.scale([], specVector, spX);
    let t = mat4.create();

    let p = 0;
    let x, y, z, w;
    for (let j = 0; j !== height; j += 1) {
      a[0] = c1[j][0];
      a[1] = c1[j][1];
      a[2] = c1[j][2];
      for (let i = 0; i !== width; i += 1) {
        x = a[0];
        y = a[1];
        z = a[2];
        w = a[3];
        t[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
        t[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
        t[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;

        if (
          t[2] >= 0 &&
          t[2] < this.volumeData.length * ratio &&
          t[0] >= 0 &&
          t[0] < this.imageWidth * ratio &&
          t[1] >= 0 &&
          t[1] < this.imageHeight * ratio
        ) {
          if (ratio === 1) {
            this.pixelData[p++] = getDefaultHu(
              this.volumeData,
              t[0],
              t[1],
              t[2],
              undefined,
              undefined,
              this.imageWidth,
              this.imageHeight
            );
          } else {
            this.pixelData[p++] = getHu(
              this.volumeData,
              t[0],
              t[1],
              t[2],
              ratio,
              this.imageWidth,
              this.imageHeight
            );
          }
        } else {
          this.pixelData[p++] = 0;
        }

        a[0] += U[0];
        a[1] += U[1];
        a[2] += U[2];
      }
    }
  }

  _calcNormalVector() {
    const { theta, phi } = this;
    const radTheta = (theta / 180) * Math.PI;
    const radPhi = (phi / 180) * Math.PI;
    this.specVector = [
      Math.cos(radPhi) * Math.cos(radTheta),
      Math.cos(radPhi) * Math.sin(radTheta),
      Math.sin(radPhi),
    ];
  }

  _calcImageSize() {
    let min = Number.MAX_SAFE_INTEGER;
    let max = Number.MIN_SAFE_INTEGER;
    let length = 0;

    const { points } = this.frenet;
    const Xs = new Array(points.length);
    const Ys = new Array(points.length);

    const { specVector } = this;
    for (let i = 0; i < Xs.length; i++) {
      Xs[i] = vec3.dot(specVector, points[i]);
      max = Math.max(max, Xs[i]);
      min = Math.min(min, Xs[i]);
    }

    max += 40;
    min -= 40;

    Xs.map((_, i, arr) => {
      arr[i] -= min;
    });

    Ys[0] = vec3.sub([], points[0], vec3.scale([], specVector, Xs[0]));
    let Y = Ys[0];

    for (let i = 0; i < Ys.length; i++) {
      Ys[i] = [];
      vec3.scale(Ys[i], specVector, Xs[i]);
      vec3.sub(Ys[i], points[i], Ys[i]);
      length += vec3.distance(Y, Ys[i]);
      Y = Ys[i];
    }

    const [spX, spY] = this.spacing;
    this.width = Math.floor((max - min) / spY + 1);
    this.height = Math.floor(length / spX);
    this.Ys = Ys;
    this.Xs = Xs;
  }

  set phi(val) {
    this._phi = +val % 360;
  }

  get phi() {
    return this._phi;
  }

  get samplerImage() {
    const [img0] = this.images;
    const img = { ...img0 };
    img.columns = this.width;
    img.rows = this.height;
    img.pixelData = this.pixelData;
    return img;
  }
}

export default StretchedSampler;
