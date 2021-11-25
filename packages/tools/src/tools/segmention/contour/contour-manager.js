class ContourManager {
  constructor() {
    this.sliceMap = new Map();
    this.keyMap = new Map();
  }

  addContour(contour) {
    let keyData = [];
    let sliceData = [];
    const { sliceId, key } = contour;
    sliceData = this.sliceMap.get(sliceId) ?? [];
    sliceData.push(contour);
    this.sliceMap.set(sliceId, sliceData);

    keyData = this.keyMap.get(key) ?? [];
    keyData.push(contour);
    this.keyMap.set(key, keyData);
  }

  getContoursBySlice(sliceId) {
    return this.sliceMap.get(sliceId) ?? [];
  }

  getContoursByKey(key) {
    return this.keyMap.get(key) ?? [];
  }

  /**
   *
   *
   * @param {*} sliceId
   * @param {*} key
   * @return { Array }
   * @memberof ContourManager
   */
  getSpecifiedContour(sliceId, key) {
    // 获取指定层下的contour
    const contours = this.getContoursBySlice(sliceId);
    const result = contours.filter((contour) => {
      return contour.key === key;
    });

    return result;
  }

  getAllSlices() {
    return Array.from(this.sliceMap.keys());
  }

  mergeContour(contours, key) {}
}

export default ContourManager;
