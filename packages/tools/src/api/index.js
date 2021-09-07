import { Component } from "@saga/core";
import { INTERNAL_EVENTS } from "../constants";
class API extends Component {
  constructor() {
    super();
  }

  rotation(rotation) {
    this.emit(INTERNAL_EVENTS.TOOL_ROTATION, { rotation });
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

  reset() {}
}
export default API;
