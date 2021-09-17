import { Component } from "@pkg/core/src";
import { INTERNAL_EVENTS, TOOL_TYPE } from "../constants";
import { TOOL_CONSTRUCTOR } from "../constructor";
import { useImageInitialState } from "../state/image-state";
import { useViewportInitialState } from "../state/viewport-state";
class API extends Component {
  constructor(stage) {
    super();
    this.playInterval = null;
    this.stageId = stage.id();
    this.stage = stage;
  }

  rotation(rotate, dispatch = true) {
    this.emit(INTERNAL_EVENTS.TOOL_ROTATION, { rotate, dispatch });
  }

  wwwc(wwwc, dispatch = true) {
    this.emit(INTERNAL_EVENTS.TOOL_WWWC, { wwwc, dispatch });
  }

  flipH(h, dispatch = true) {
    this.emit(INTERNAL_EVENTS.TOOL_FLIPH, { h, dispatch });
  }

  flipV(v, dispatch = true) {
    this.emit(INTERNAL_EVENTS.TOOL_FLIPV, { v, dispatch });
  }

  invert(invert, dispatch = true) {
    this.emit(INTERNAL_EVENTS.TOOL_INVERT, { invert, dispatch });
  }

  scale(scale, dispatch = true) {
    this.emit(INTERNAL_EVENTS.TOOL_SCALE, { scale, dispatch });
  }

  polygon(params = []) {
    params.forEach((item) => {
      new TOOL_CONSTRUCTOR[TOOL_TYPE.RECT]({ stage: this.stage, ...item });
    });
  }

  reset() {
    const [initialState] = useViewportInitialState(this.stageId);
    const [initialImageState] = useImageInitialState(this.stageId);
    const { rotate, offset, scale } = initialState;
    this.emit(INTERNAL_EVENTS.TOOL_ROTATION, { rotate });
    this.emit(INTERNAL_EVENTS.TOOL_TRANSLATE, { offset });
    this.emit(INTERNAL_EVENTS.TOOL_SCALE, { scale });
    this.emit(INTERNAL_EVENTS.TOOL_WWWC, { wwwc: initialImageState.wwwc });
    this.emit(INTERNAL_EVENTS.TOOL_FLIPH, { h: false });
    this.emit(INTERNAL_EVENTS.TOOL_FLIPV, { v: false });
    this.emit(INTERNAL_EVENTS.TOOL_INVERT, { invert: false });
  }

  play(speed) {
    clearInterval(this.playInterval);
    const s = Math.max(0.25, Math.min(speed, 5));
    this.playInterval = setInterval(() => {
      this.emit(INTERNAL_EVENTS.TOOL_STACK_CHANGE, { delta: 1, loop: true });
    }, 1000 / s);
  }

  stop() {
    clearInterval(this.playInterval);
  }
}
export default API;
