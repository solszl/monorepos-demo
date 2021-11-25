class AbstractBrush {
  constructor() {
    this.shadowCanvas = null;
    this.strokeWidth = 10;
  }

  setStrokeWidth(val) {
    this.strokeWidth = val;
  }

  onMouseDown(e) {}

  onMouseUp(e) {}

  onMouseMove(e) {}
}

export default AbstractBrush;
