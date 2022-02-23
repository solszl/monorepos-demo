export const MsgTypes = {
  /** 获取拉直中线 */
  LUMEN_CENTERLINE: "cpr_lumen|>lumen.lines",
  /** 获取轴位图的影像资源 */
  AXIAL_DCM: "cpr_lumen|>axial.dcm",
  /** 获取探针截图列表 */
  PROBE_DCM: "cpr_lumen|>probe.dcm",
  /** 获取拉直图影像资源 */
  LUMEN_DCM: "cpr_lumen|>lumen.dcm",
  /** 获取拉伸图像影像资源 */
  CPR_DCM: "cpr_lumen|>cpr.dcm",
  /** 体渲染控制血管名称显隐 */
  VR_VESSEL_TEXT: "vr|>vessel.text",
  /** VMIP控制血管名称显隐 */
  MIP_VESSEL_TEXT: "mip|>vessel.text",
  /** VR_TREE控制血管名称显隐 */
  VRTREE_VESSEL_TEXT: "vr_tree|>vessel.text",
  /** 头颈CTA中，切换各种视图的函数 */
  RENDER_TYPE_TOGGLE: "render|>render.type.toggle",
  /** 获取MIP下不同面的总层数 */
  MIP_GET_COUNT: "mip|>get.total.count",
  /** 获取MIP下不同层面的dicom图像 */
  MIP_GET_DICOM: "mip|>generate.mip.dcm",
};
