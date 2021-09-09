import { TOOL_TYPE } from "./constants";
import AngleTool from "./tools/annotation/angle-tool";
import EllipseTool from "./tools/annotation/ellipse-tool";
import LengthTool from "./tools/annotation/length-tool";
import ProbeTool from "./tools/annotation/probe-tool";
import MagnifyTool from "./tools/magnify-tool";
import PolygonTool from "./tools/polygon-tool";
import RotationTool from "./tools/rotation-tool";
import ScaleTool from "./tools/scale-tool";
import StackTool from "./tools/stack-tool";
import StackWheelTool from "./tools/stack-wheel-tool";
import TranslateTool from "./tools/translate-tool";
import WWWCTool from "./tools/wwwc-tool";

export const TOOL_CONSTRUCTOR = {
  [TOOL_TYPE.LENGTH]: LengthTool,
  [TOOL_TYPE.ANGLE]: AngleTool,
  [TOOL_TYPE.ROTATION]: RotationTool,
  [TOOL_TYPE.SCALE]: ScaleTool,
  [TOOL_TYPE.POLYGON]: PolygonTool,
  [TOOL_TYPE.TRANSLATE]: TranslateTool,
  [TOOL_TYPE.WWWC]: WWWCTool,
  [TOOL_TYPE.MAGNIFYING]: MagnifyTool,
  [TOOL_TYPE.PROBE]: ProbeTool,
  [TOOL_TYPE.STACK_SCROLL]: StackTool,
  [TOOL_TYPE.STACK_WHEEL_SCROLL]: StackWheelTool,
  [TOOL_TYPE.ELLIPSE_ROI]: EllipseTool,
};
