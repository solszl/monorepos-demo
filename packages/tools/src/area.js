class Area {
  constructor(config = {}) {
    if (Reflect.ownKeys(config).length) {
      this.update(config);
    }
  }

  update(config) {}

  isIn(x, y) {
    return x >= this.x && x < this.width + x && y >= this.y && y < this.y + this.height;
  }
}

export default Area;
