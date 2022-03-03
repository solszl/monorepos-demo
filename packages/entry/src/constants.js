export const EVENTS = {
  /** 层面切换的时候派发 */
  SLICE_CHANGED: "slice_changed",
  /** 影响属性尺寸、位置等发生变化派发 */
  MATRIX_CHANGED: "matrix_changed",
  /** 影像渲染完后派发 */
  IMAGE_RENDERED: "image_rendered",
  /** 影像渲染完后，派发所有的数据给前台, 但是不建议监听该事件*/
  RENDER_COMPLETED: "render_completed",
  /** Tool data 数据变更 */
  TOOL_DATA_UPDATED: "tool_data_updated",
  /** Tool data 被移除 */
  TOOL_DATA_REMOVED: "tool_data_removed",
  /** 工具右键点击派发事件 */
  TOOL_DATA_CONTEXTMENU_CLICK: "tool_data_contextmenu_click",
  /** 拉直、拉伸图像中，游标位置变化事件 */
  VERNIER_INDEX_CHANGED: "vernier_index_changed",
  TAG_STATE_CHANGED: "tag_state_changed",
};
