import { Line } from "konva/lib/shapes/Line";

let DEFAULT_CONFIG = {
  stroke: "#ff0000e6",
  strokeWidth: 3,
  lineCap: "round",
  lineJoin: "round",
};
class Centerline2D extends Line {
  constructor(config = {}) {
    super(Object.assign({}, DEFAULT_CONFIG, config));
    this._path = [];
  }

  set path(arr = []) {
    this._path = arr;
    this.points(arr.flat(10));
  }
  get path() {
    return this._path;
  }
}

export default Centerline2D;
