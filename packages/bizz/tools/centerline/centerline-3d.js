class Centerline3D {
  constructor() {
    this._path = null;
  }

  set path(val) {
    this._path = val;
  }

  get path() {
    return this._path;
  }
}

export default Centerline3D;
