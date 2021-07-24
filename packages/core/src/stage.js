import EventEmitter from "event-emitter";
import { INTERNAL_EVENT } from "./internal";

const selfRequestAnimationFrame = (callback) => {
  return setInterval(callback, 30);
};

const selfCancelRequestAnimationFrame = (id) => {
  clearInterval(id);
};
const RAF = window.requestAnimationFrame || selfRequestAnimationFrame;
const CRAF = window.cancelAnimationFrame || selfCancelRequestAnimationFrame;

class Stage {
  constructor() {
    EventEmitter(this);
    this._fps = 30;
    this.fpsInterval = Math.ceil(1000 / this._fps);
    this.lastRenderTime = Date.now();
  }

  render() {
    const { isRunning } = this;
    if (!isRunning) {
      return;
    }
    const { lastRenderTime, fpsInterval } = this;
    const now = Date.now();
    const elapsed = now - lastRenderTime;
    if (elapsed < fpsInterval) {
      CRAF(this.rafInterval);
      this.rafInterval = RAF(this.render.bind(this));
      return;
    }

    this.lastRenderTime = now;
    this.emit(INTERNAL_EVENT.ENTER_FRAME);
  }

  startRender() {
    this.isRunning = true;
    this.rafInterval = RAF(this.render.bind(this));
  }

  stopRender() {
    this.isRunning = false;
    CRAF(this.rafInterval);
  }

  set fps(val) {
    if (this.fps === +val) {
      return;
    }

    this._fps = +val;
    if (val === 0) {
      CRAF(this.rafInterval);
      return;
    }

    this.fpsInterval = Math.ceil(1000 / +val);
  }

  get fps() {
    return this._fps;
  }
}

export default Stage;
