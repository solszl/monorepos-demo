import { Group } from "konva/lib/Group";
import { Line } from "konva/lib/shapes/Line";
import Vernier from "../vernier/vernier";

let DEFAULT_CONFIG = {
  stroke: "#27b2d3",
  strokeWidth: 2,
  lineCap: "round",
  lineJoin: "round",
};
class Centerline2D extends Group {
  constructor(config = {}) {
    super(Object.assign({}, config, { id: "centerline2d" }));
    this._path = [];

    let line = new Line(Object.assign({}, DEFAULT_CONFIG, { id: "line" }));
    this.add(line);
    let vernier = new Vernier({ count: 2, offset: 2, dragMode: 3 }, { id: "vernier" });
    this.add(vernier);
  }

  set path(arr = []) {
    this._path = arr;
    const line = this.findOne("#line");
    line.points(arr.flat(10));
  }
  get path() {
    return this._path;
  }

  setData(data) {
    const { data: path } = data;
    /**
     * 中线数据格式为
     * [
     *  {others:[[x,y],[x,y]]},
     *  {vessel11:[[x,y],[x,y]]},
     * ]
     */
    this.originPath = path.reduce((prev, curr) => {
      return prev.concat(Object.values(curr).flat());
    }, []);
    this.autofit();

    const vernier = this.findOne("#vernier");
    vernier.currentIndex = 0;
  }

  renderData() {}

  autofit() {
    let path = this.originPath.map((point) => {
      return this.$transform.transformPoint(point[0], point[1]);
    });

    this.path = path;
    const vernier = this.findOne("#vernier");
    vernier.path = this.path;
  }

  updateProps(props) {
    const { visible } = props;
    if (visible !== undefined) {
      const line = this.findOne("#line");
      line.visible(visible);
    }

    const { vernierIndex } = props;
    if (vernierIndex !== undefined) {
      const vernier = this.findOne("#vernier");
      vernier.currentIndex = vernierIndex;
    }
  }
}

export default Centerline2D;
