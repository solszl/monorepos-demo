import { vec3 } from "gl-matrix";
/**
 * 2d 数据集
 *
 * @class Volume
 */
class Volume {
  constructor() {
    this.minValue = Number.MAX_SAFE_INTEGER;
    this.maxValue = Number.MIN_SAFE_INTEGER;
    this.data = null;
  }

  pretreatmentData(allImageData) {
    const [img0, img1] = allImageData;
    const { rows, columns } = img0;
    const perLength = rows * columns;
    const z = allImageData.length;

    this.dimensionInfo = {};
    const spZ = vec3.sub(vec3.create(), img1.imagePositionPatient, img0.imagePositionPatient)[2];
    const spacing = [img0.columnPixelSpacing, img0.rowPixelSpacing, spZ];
    this.dimensionInfo.spacing = spacing;
    this.dimensionInfo.origin = img0.imagePositionPatient;
    this.dimensionInfo.sizeInPx = [columns, rows, z];
    this.dimensionInfo.center = [columns / 2, rows / 2, z / 2];
    // this.dimensionInfo.sizeInPh = [
    //   columns * spacing[0],
    //   rows * spacing[1],
    //   allImageData.length * spZ,
    // ];
    // this.dimensionInfo.vertexInPx = [
    //   [0, 0, 0],
    //   [columns, 0, 0],
    //   [columns, rows, 0],
    //   [0, rows, 0],
    //   [0, 0, z],
    //   [columns, 0, z],
    //   [columns, rows, z],
    //   [0, rows, z],
    // ];
    this.cubeEdges = this._getEdges();

    this.data = new Uint16Array(perLength * z);
    // orientation, position, spacing, thickness, betweenSliceThickness etc..
    allImageData.forEach((image, index) => {
      const { pixelData, minPixelValue, maxPixelValue } = image;
      this.data.set(pixelData, index * perLength);
      this.minValue = this.minValue > minPixelValue ? minPixelValue : this.minValue;
      this.maxValue = this.maxValue < maxPixelValue ? maxPixelValue : this.maxValue;
    });
  }

  isInVolume(point) {
    // const [x, y, z] = this.dimensionInfo.sizeInPx;
    // const [px, py, pz] = point;
    // return px >= 0 && px < x && py >= 0 && py < y && pz >= 0 && pz < z;

    // const { sizeInPx } = this.dimensionInfo;
    // return point.reduce((flag, p, index) => {
    //   if (p >= 0 && p <= sizeInPx[index]) {
    //     return true;
    //   }
    //   return false;
    // }, false);

    // const [x, y, z] = this.dimensionInfo.sizeInPx;
    // const [px, py, pz] = point;
    // if (px < 0 || px >= x) {
    //   return false;
    // }

    // if (py < 0 || py >= y) {
    //   return false;
    // }

    // if (pz < 0 || pz >= z) {
    //   return false;
    // }

    // return true;

    const { sizeInPx } = this.dimensionInfo;
    if (point[0] < 0 || point[0] >= sizeInPx[0]) {
      // console.log(point);
      return false;
    }
    if (point[1] < 0 || point[1] >= sizeInPx[1]) {
      // console.log(point);
      return false;
    }
    if (point[2] < 0 || point[2] >= sizeInPx[2]) {
      // console.log(point);
      return false;
    }
    return true;
  }

  getValue(x, y, z) {
    // const [columns, rows, depth] = this.dimensionInfo.sizeInPx; // speed up!
    const { sizeInPx } = this.dimensionInfo;
    const offset = sizeInPx[0] * sizeInPx[1] * z;
    const index = x * sizeInPx[0] + y + offset;
    return this.data[index];
  }

  /**
   * 获取当前dicom体数据的外包围盒
   *
   * @return { array }
   * @memberof Volume
   */
  _getEdges() {
    let edges = [];
    const [x, y, z] = this.dimensionInfo.sizeInPx;
    // edges item = [ point, point_vector ];
    // const p0 = [0, 0, 0];
    // const p0v = [x, 0, 0];
    // edges.push([p0, p0v]);
    // const p1 = [0, 0, 0];
    // const p1v = [0, y, 0];
    // edges.push([p1, p1v]);
    // const p2 = [0, 0, 0];
    // const p2v = [0, 0, z];
    // edges.push([p2, p2v]);
    // const p3 = [x, 0, 0];
    // const p3v = [0, 0, z];
    // edges.push([p3, p3v]);
    // const p4 = [0, 0, z];
    // const p4v = [x, 0, 0];
    // edges.push([p4, p4v]);
    // const p5 = [0, y, 0];
    // const p5v = [x, 0, 0];
    // edges.push([p5, p5v]);
    // const p6 = [0, y, 0];
    // const p6v = [0, 0, z];
    // edges.push([p6, p6v]);
    // const p7 = [x, y, 0];
    // const p7v = [0, 0, z];
    // edges.push([p7, p7v]);
    // const p8 = [0, y, z];
    // const p8v = [x, 0, 0];
    // edges.push([p8, p8v]);
    // const p9 = [0, 0, z];
    // const p9v = [0, y, 0];
    // edges.push([p9, p9v]);
    // const p10 = [x, 0, 0];
    // const p10v = [0, y, 0];
    // edges.push([p10, p10v]);
    // const p11 = [x, 0, z];
    // const p11v = [0, y, 0];
    // edges.push([p11, p11v]);

    // 四个顶点
    const p1 = [0, 0, 0];
    const p2 = [x, y, 0];
    const p3 = [0, y, z];
    const p4 = [x, 0, z];

    // 每个顶点对外仿射三条边
    const v11 = [0, 0, z];
    const v12 = [x, 0, 0];
    const v13 = [0, y, 0];

    const v24 = [0, y, 0];
    const v25 = [x, y, z];
    const v26 = [x, 0, 0];

    const v37 = [0, y, 0];
    const v38 = [x, y, z];
    const v39 = [0, 0, z];

    const v410 = [0, 0, z];
    const v411 = [x, 0, 0];
    const v412 = [x, y, z];
    edges.push([p1, v11]);
    edges.push([p1, v12]);
    edges.push([p1, v13]);
    edges.push([p2, v24]);
    edges.push([p2, v25]);
    edges.push([p2, v26]);
    edges.push([p3, v37]);
    edges.push([p3, v38]);
    edges.push([p3, v39]);
    edges.push([p4, v410]);
    edges.push([p4, v411]);
    edges.push([p4, v412]);
    return edges;
  }
}

export default Volume;
