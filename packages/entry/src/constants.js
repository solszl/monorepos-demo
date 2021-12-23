export const EVENTS = {
  /** 层面切换的时候派发 */
  SLICE_CHANGED: "slice_changed",
  /** 影响属性尺寸、位置等发生变化派发 */
  MATRIX_CHANGED: "matrix_changed",
  /** 影响渲染完后派发 */
  IMAGE_RENDERED: "image_rendered",
  /** Tool data 数据变更 */
  TOOL_DATA_UPDATED: "tool_data_updated",
  /** Tool data 被移除 */
  TOOL_DATA_REMOVED: "tool_data_removed",
};
