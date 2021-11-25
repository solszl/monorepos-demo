import { findBoundingRect } from "../utils/find-bounding-rect";
class ContourItem {
  constructor() {
    // data 下 会有多个数组，每个数组是一个轮廓,每个轮廓由若干个点组成
    this.data = [
      [
        [0, 0],
        [0, 0],
        [1, 1],
        [1, 1],
      ],
      [
        [0, 0],
        [0, 0],
        [1, 1],
        [1, 1],
      ],
    ];
    this.boundRect = [0, 0, 0, 0];
    this.sliceId = -1;
    this.key = "unknown";
  }

  calcBoundRect() {
    this.boundRect = findBoundingRect(this.data);
  }
}

export default ContourItem;
