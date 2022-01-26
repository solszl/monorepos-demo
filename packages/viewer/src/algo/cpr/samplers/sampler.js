import Coordinate from "../coordinate";

class Sampler {
  constructor(options = {}) {
    this._images = [];
    this._theta = 0;
    this._frenet = null;
    this.spacing = options["spacing"] ?? [0.5, 0.5];
    this._pixelData = [];
  }

  prepareForGenerate() {}

  generate() {
    // override be subclass
  }

  set images(val) {
    this._images = val;
    this.volumeData = this.images.map((img) => img.pixelData);
    const [img0] = this.images;
    this.imageWidth = img0.columns;
    this.imageHeight = img0.rows;
  }

  get images() {
    return this._images;
  }

  set theta(val) {
    this._theta = +val % 360;
  }

  get theta() {
    return this._theta;
  }

  set frenet(val) {
    this._frenet = val;
  }

  get frenet() {
    return this._frenet;
  }

  set ratio(val) {
    this._ratio = val;
    if (this.images.length < 2) {
      return;
    }

    const coordinate = new Coordinate(this.images);
    this.ijk2lps = coordinate.ijk2lps(val);
    this.lps2ijk = coordinate.lps2ijk();
  }

  get ratio() {
    return this._ratio;
  }

  get pixelData() {
    return this._pixelData;
  }

  get samplerImage() {}

  get samplerResult() {}
}

export default Sampler;
