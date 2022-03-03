export const API_METHOD = {
  tag: "coronary.tag",
  plane: (plane) => {
    return PLANE_METHOD[plane];
  },
};

export const PLANE_METHOD = {
  axial: "coronary.dicom.axial",
  sagittal: "coronary.dicom.sagittal",
  coronary: "coronary.dicom.coronary",
};

const PREFIX = "viewer_";
export const VIEWER_INTERNAL_EVENTS_EXTENDS = {
  /** 中线显隐状态属性变更 */
  CENTERLINE_STATE_CHANGED: `${PREFIX}centerline_state_changed`,
  /** 中线数据发生变化 */
  CENTERLINE_DATA_CHANGED: `${PREFIX}centerline_data_changed`,
  /** 分段信息显隐属性变更 */
  SEGMENT_STATE_CHANGED: `${PREFIX}segment_state_changed`,
  /** 分段信息数据发生变化 */
  SEGMENT_DATA_CHANGED: `${PREFIX}segment_data_changed`,
  /** 血管名称键值对属性变更 */
  VESSEL_KEYMAP_CHANGED: `${PREFIX}vessel_keymap_changed`,
  /** 游标索引变更 */
  VERNIER_INDEX_CHANGED: `${PREFIX}vernier_index_changed`,
  /** cpr tag 数据变更 */
  CPR_TAGS_CHANGED: `${PREFIX}cpr_tags_changed`,
  /** cpr 高亮变更 */
  CPR_HIGHLIGHT_CHANGED: `${PREFIX}cpr_highlight_changed`,
};
