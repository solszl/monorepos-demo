import { TOOL_TYPE, TOOL_TYPE_EXTENDS } from "./constants";
import Centerline2D from "./extends/centerline/centerline-2d";
import MarkLine from "./extends/markline/markline";
// import Centerline3D from "./extends/centerline/centerline-3d";
import Segment from "./extends/segments/segment";
import TagGroup from "./extends/tag/tag-group";
import AngleTool from "./tools/annotation/angle-tool";
import EllipseTool from "./tools/annotation/ellipse-tool";
import LengthTool from "./tools/annotation/length-tool";
import ProbeTool from "./tools/annotation/probe-tool";
import RectTool from "./tools/annotation/rect-tool";
import RoiTool from "./tools/annotation/roi-tool";
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
  [TOOL_TYPE.RECT]: RectTool,
  [TOOL_TYPE.ROI]: RoiTool,
  [TOOL_TYPE_EXTENDS.VESSEL_SEGMENT]: Segment,
  [TOOL_TYPE_EXTENDS.CENTERLINE2D]: Centerline2D,
  // [TOOL_TYPE_EXTENDS.CENTERLINE3D]: Centerline3D,
  [TOOL_TYPE_EXTENDS.TAG_GROUP]: TagGroup,
  [TOOL_TYPE_EXTENDS.MARKLINE]: MarkLine,
};
