import LengthTool from "./tools/annotation/length-tool";

export const TOOL_TYPE = {
  STACK_SCROLL: "stack_scroll",
  MOVE: "move",
  MAGNIFYING: "magnifying",
  ZOOM: "zoom",
  WWWC: "wwwc",
  LENGTH: "length",
  ANGLE: "angle",
  PROBE: "probe",
  ELLIPSE_ROI: "ellipse_roi",
};

export const EVENTS = {
  MOUSE_DOWN: "tx_mouse_down",
  MOUSE_UP: "tx_mouse_up",
  MOUSE_CLICK: "tx_mouse_click",
  MOUSE_DOUBLE_CLICK: "tx_mouse_double_click",
  MOUSE_WHEEL: "tx_mouse_wheel",
};

export const TOOL_CONSTRUCTOR = {
  [TOOL_TYPE.LENGTH]: LengthTool,
};
