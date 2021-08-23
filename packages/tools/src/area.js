class Area {
  constructor(config = {}) {
    if (Reflect.ownKeys(config).length) {
      this.update(config);
    }
  }

  update(config) {
    const { rootSize, offset, scale } = config;
    // 设置视窗
  }

  isIn(x, y) {
    return x >= this.x && x < this.width + x && y >= this.y && y < this.y + this.height;
  }
}

export default Area;
