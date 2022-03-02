class Centerline2DBizz {
  constructor() {
    this.path = [];
  }

  setData(path) {
    if (!Array.isArray(path)) {
      console.warn("中线数据格式不正确");
      this.path = [];
      return;
    }

    let localPath = path.reduce((prev, curr) => {
      return prev.concat(Object.values(curr).flat());
    }, []);
    this.path = localPath;
  }

  get total() {
    return this.path.length;
  }
}

export default Centerline2DBizz;
