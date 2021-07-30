import Volume from "./volume";
import Plane from "./plane";
import { vectorUtil } from "../math";

class ObliqueSampler {
  /**
   * @param { Volume} volume
   * @param { Plane } plane
   * @memberof ObliqueSampler
   */
  constructor(volume, plane) {
    this.volume = volume;
    this.plane = plane;

    this._samplingFactor = 1;

    /** @type { Array<Array,Array>} */
    this._cubeEdges = this.volume.cubeEdges;

    this.planePolygon = null;
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
    for (let i = 0; i < this._cubeEdges.length; i += 1) {
      const [point, pointVector] = this._cubeEdges[i];
      const tempHitPoint = this._getHitPoint(point, pointVector, this.plane);
      if (tempHitPoint && this.volume.isInVolume(tempHitPoint)) {
        let isIn = false;
        for (let j = 0; j < hitPoints.length; j += 1) {
          const hp = hitPoints[j];
          if (hp[0] === tempHitPoint[0] && hp[1] === tempHitPoint[1] && hp[2] === tempHitPoint[2]) {
            isIn = true;
            break;
          }
        }

        if (!isIn) {
          hitPoints.push(tempHitPoint);
        }
      }
    }

    this.planePolygon = hitPoints.length > 0 ? hitPoints : null;
  }

  /** 根据查找出的切面点确定二维坐标系 */
  findVertices2DCoords() {
    if (!this.planePolygon) {
      return;
    }

    const u = this.plane.getUVector();
    const v = this.plane.getVVector();
    const n = this.plane.getNVector();

    const diagonal = Math.round(this._getDiagonal());
    const obliqueImageCenter = [Math.round(diagonal / 2), Math.round(diagonal / 2)];
    const startingSeed = this._getStartingSeed();

    this._planePolygon2D = [];
    for (let i = 0; i < this.planePolygon.length; i += 1) {
      var vertices3D = this.planePolygon[i];
      const dx = vertices3D[0] - startingSeed[0];
      const dy = vertices3D[1] - startingSeed[1];
      const dz = vertices3D[2] - startingSeed[2];

      // 假设 (startingSeed + a*u + b*v c*n = vertice3D)
      var commonDenom =
        u[0] * (n[1] * v[2] - v[1] * n[2]) +
        v[0] * (u[1] * n[2] - n[1] * u[2]) +
        n[0] * (v[1] * u[2] - u[1] * v[2]);

      var aNom =
        dx * (n[1] * v[2] - v[1] * n[2]) +
        v[0] * (dy * n[2] - n[1] * dz) +
        n[0] * (v[1] * dz - dy * v[2]);

      var a = aNom / commonDenom;

      var bNom =
        dx * (n[1] * u[2] - u[1] * n[2]) +
        u[0] * (dy * n[2] - n[1] * dz) +
        n[0] * (u[1] * dz - dy * u[2]);

      var b = (-1 * bNom) / commonDenom;

      var cNom =
        dx * (v[1] * u[2] - u[1] * v[2]) +
        u[0] * (dy * v[2] - v[1] * dz) +
        v[0] * (u[1] * dz - dy * u[2]);

      var c = cNom / commonDenom;

      var point = [
        obliqueImageCenter[0] + b * this._samplingFactor,
        obliqueImageCenter[1] + a * this._samplingFactor,
      ];

      this._planePolygon2D.push(point);
    }
  }

  /**
   * 开始采样，从中间点（centerSeed开始）采用泛洪四向填充图像数据
   *
   * @memberof ObliqueSampler
   */
  startSampling() {
    console.time("sample");
    const startingSeed = this._getStartingSeed();
    const diagonal = Math.round(this._getDiagonal());
    const obliqueImageCenter = [Math.round(diagonal / 2), Math.round(diagonal / 2)];
    this._initObliqueImage(diagonal, diagonal);
    let pixelStack = [];
    pixelStack.push(obliqueImageCenter);

    while (pixelStack.length > 0) {
      // const [x, y] = pixelStack.pop(); // 30% speed up.
      const currentPixel = pixelStack.pop();
      const x = currentPixel[0];
      const y = currentPixel[1];

      if (this.getMaskValue(x, y) !== 0) {
        continue;
      }

      this.setMaskValue(x, y, 255);

      // oblique image coords to volume coords
      let cubeCoords = this._obliqueCoordsToVolumeCoords(
        startingSeed,
        x - obliqueImageCenter[0],
        y - obliqueImageCenter[1]
      );

      // const value = this.volume.getValue(...cubeCoords);
      const value = this.volume.getValue(cubeCoords[0], cubeCoords[1], cubeCoords[2]);
      this.setImageValue(x, y, value);

      // top
      const tx = x;
      const ty = y - 1;
      if (this.getMaskValue(tx, ty) === 0) {
        const isTopInVolume = this._obliqueCoordsInVolume(
          startingSeed,
          tx - obliqueImageCenter[0],
          ty - obliqueImageCenter[1]
        );
        if (isTopInVolume) {
          pixelStack.push([tx, ty]);
        }
      }

      // bottom
      const bx = x;
      const by = y + 1;
      if (this.getMaskValue(bx, by) === 0) {
        const isBottomInVolume = this._obliqueCoordsInVolume(
          startingSeed,
          bx - obliqueImageCenter[0],
          by - obliqueImageCenter[1]
        );
        if (isBottomInVolume) {
          pixelStack.push([bx, by]);
        }
      }

      const lx = x - 1;
      const ly = y;
      if (this.getMaskValue(lx, ly) === 0) {
        const isLeftInVolume = this._obliqueCoordsInVolume(
          startingSeed,
          lx - obliqueImageCenter[0],
          ly - obliqueImageCenter[1]
        );
        if (isLeftInVolume) {
          pixelStack.push([lx, ly]);
        }
      }

      // right
      const rx = x + 1;
      const ry = y;
      if (this.getMaskValue(rx, ty) === 0) {
        const isRightInVolume = this._obliqueCoordsInVolume(
          startingSeed,
          rx - obliqueImageCenter[0],
          ry - obliqueImageCenter[1]
        );
        if (isRightInVolume) {
          pixelStack.push([rx, ry]);
        }
      }
    }

    console.timeEnd("sample");
    console.log("resample over.", this._obliqueImage);
  }

  setImageValue(x, y, val) {
    const { width, height } = this._obliqueImage;
    if (x >= 0 && x < width && y >= 0 && y < height) {
      this._obliqueImage.data[x * width + y] = val;
    }
  }
  getImageValue(x, y) {
    const { width, height } = this._obliqueImage;
    if (x >= 0 && x < width && y >= 0 && y < height) {
      return this._obliqueImage.data[x * width + y];
    }
  }

  setMaskValue(x, y, val) {
    const { width, height } = this._obliqueImage;
    if (x >= 0 && x < width && y >= 0 && y < height) {
      this._obliqueImage.mask[x * width + y] = val;
    }
  }
  getMaskValue(x, y) {
    const { width, height } = this._obliqueImage;
    if (x >= 0 && x < width && y >= 0 && y < height) {
      return this._obliqueImage.mask[x * width + y];
    }
  }

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
    let affineSystem = vectorUtil.affine3DFromVectorAndPoint(vector, point);
    let planeEquation = plane.getEquation();

    const tNumerator =
      planeEquation[0] * affineSystem[0][0] +
      planeEquation[1] * affineSystem[1][0] +
      planeEquation[2] * affineSystem[2][0] +
      planeEquation[3];

    const tDenominator =
      -1 *
      (planeEquation[0] * affineSystem[0][1] +
        planeEquation[1] * affineSystem[1][1] +
        planeEquation[2] * affineSystem[2][1]);

    const t = tNumerator / tDenominator;

    const x = affineSystem[0][0] + affineSystem[0][1] * t;
    const y = affineSystem[1][0] + affineSystem[1][1] * t;
    const z = affineSystem[2][0] + affineSystem[2][1] * t;

    if (x === Infinity || y === Infinity || z === Infinity) {
      return null;
    }

    if (isNaN(x) || isNaN(y) || isNaN(z)) {
      return null;
    }

    return [x, y, z];
  }

  _getDiagonal() {
    const [x, y, z] = this.volume.dimensionInfo.sizeInPx;
    return Math.sqrt(x ** 2 + y ** 2 + z ** 2);
  }

  _getStartingSeed() {
    if (!this.planePolygon) {
      return null;
    }

    let xSum = 0;
    let ySum = 0;
    let zSum = 0;
    const numOfVertex = this.planePolygon.length;
    for (let i = 0; i < numOfVertex; i += 1) {
      xSum += this.planePolygon[i][0];
      ySum += this.planePolygon[i][1];
      zSum += this.planePolygon[i][2];
    }

    const xCenter = xSum / numOfVertex;
    const yCenter = ySum / numOfVertex;
    const zCenter = zSum / numOfVertex;

    return [xCenter, yCenter, zCenter];
  }

  _initObliqueImage(width, height) {
    if (this?.image?.width !== width || this?.image?.height !== height) {
      this._obliqueImage = {
        data: new Uint16Array(width * height).fill(-2000),
        mask: new Int8Array(width * height),
        width,
        height,
      };
    }
    this.image.data.fill(-2000);
    this.image.mask.fill(0);
  }

  _obliqueCoordsToVolumeCoords(startingSeed, dx, dy) {
    const u = this.plane.getUVector();
    const v = this.plane.getVVector();

    const target3DPoint = [
      startingSeed[0] + (dx * u[0]) / this._samplingFactor + (dy * v[0]) / this._samplingFactor,
      startingSeed[1] + (dx * u[1]) / this._samplingFactor + (dy * v[1]) / this._samplingFactor,
      startingSeed[2] + (dx * u[2]) / this._samplingFactor + (dy * v[2]) / this._samplingFactor,
    ];

    return target3DPoint;
  }

  _obliqueCoordsInVolume(startingSeed, dx, dy) {
    const volumeCoords = this._obliqueCoordsToVolumeCoords(startingSeed, dx, dy);
    return this.volume.isInVolume(volumeCoords);
  }

  get image() {
    return this._obliqueImage;
  }
}

export default ObliqueSampler;
