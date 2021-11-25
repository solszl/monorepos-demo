import AbstractBrush from "./abstract-brush";
class EraserDauber extends AbstractBrush {
  constructor() {
    super();
  }

  onMouseDown(e) {
    super.onMouseDown(e);
    const ctx = this.shadowCanvas.getContext();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.lineWidth = this.strokeWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#ccc";
    ctx.moveTo(e.clientX, e.clientY);
  }

  onMouseMove(e) {
    super.onMouseMove(e);
    const ctx = this.shadowCanvas.getContext();
    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();
  }
}

export default EraserDauber;
