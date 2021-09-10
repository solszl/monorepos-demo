import { Component } from "@saga/core";
import { INTERNAL_EVENTS } from "../constants";
import { useImageInitialState } from "../state/image-state";
import { useViewportInitialState } from "../state/viewport-state";
class API extends Component {
  constructor(id) {
    super();
    this.playInterval = null;
    this.stageId = id;
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

  reset() {
    const [initialState] = useViewportInitialState(this.stageId);
    const [initialImageState] = useImageInitialState(this.stageId);
    const { rotate, offset, scale } = initialState;
    // console.log(initialImageState);
    // this.emit(INTERNAL_EVENTS.TOOL_ROTATION, { rotate });
    // this.emit(INTERNAL_EVENTS.TOOL_TRANSLATE, { offset });
    // this.emit(INTERNAL_EVENTS.TOOL_SCALE, { scale });
    // this.emit(INTERNAL_EVENTS.TOOL_WWWC, { wwwc: initialImageState.wwwc });
    // this.emit(INTERNAL_EVENTS.TOOL_FLIPH, { h: false });
    // this.emit(INTERNAL_EVENTS.TOOL_FLIPV, { v: false });
    // this.emit(INTERNAL_EVENTS.TOOL_INVERT, { invert: false });
    // setImageState({
    //   wwwc: { ww: 0, wc: 0 },
    //   h: false,
    //   v: false,
    //   invert: false,
    // });
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
