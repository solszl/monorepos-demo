import { Component } from "@saga/core";
import { INTERNAL_EVENTS } from "../constants";
import { initState } from "../state/viewport-state";
class API extends Component {
  constructor() {
    super();
  }

  rotation(rotate) {
    this.emit(INTERNAL_EVENTS.TOOL_ROTATION, { rotate });
  }

  wwwc(wwwc) {
    this.emit(INTERNAL_EVENTS.TOOL_WWWC, { wwwc });
  }

  flipH(h) {
    this.emit(INTERNAL_EVENTS.TOOL_FLIPH, { h });
  }

  flipV(v) {
    this.emit(INTERNAL_EVENTS.TOOL_FLIPV, { v });
  }

  invert(invert) {
    this.emit(INTERNAL_EVENTS.TOOL_INVERT, { invert });
  }

  reset() {
    const { rotate, x, y, scale } = initState;
    this.emit(INTERNAL_EVENTS.TOOL_ROTATION, { rotate });
    this.emit(INTERNAL_EVENTS.TOOL_TRANSLATE, { offset: { x, y } });
    this.emit(INTERNAL_EVENTS.TOOL_SCALE, { scale });
    this.emit(INTERNAL_EVENTS.TOOL_WWWC, { wwwc: { ww: 0, wc: 0 } });
    this.emit(INTERNAL_EVENTS.TOOL_FLIPH, { h: false });
    this.emit(INTERNAL_EVENTS.TOOL_FLIPV, { v: false });
    this.emit(INTERNAL_EVENTS.TOOL_INVERT, { invert: false });
  }
}
export default API;
