import { Component } from "@saga/core";
import { INTERNAL_EVENTS } from "../constants";
class API extends Component {
  constructor() {
    super();
  }

  rotation(args) {
    this.emit(INTERNAL_EVENTS.TOOL_ROTATION, args);
  }

  wwwc(args) {
    this.emit(INTERNAL_EVENTS.TOOL_WWWC, { wwwc: args });
  }

  reset() {}
}
export default API;
