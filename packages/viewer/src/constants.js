const PREFIX = "viewer_";
export const VIEWER_INTERNAL_EVENTS = {
  /** 父容器大小发生变化*/
  ROOT_SIZE_CHANGED: `${PREFIX}root_size_changed`,
  /** 容器位置发生变化*/
  POSITION_CHANGED: `${PREFIX}position_changed`,
  /** 视图大小发生变化*/
  SIZE_CHANGED: `${PREFIX}size_changed`,
  /** 页码切换*/
  SLICE_CHANGED: `${PREFIX}slice_changed`,
  /** 视图旋转*/
  ROTATION_CHANGED: `${PREFIX}rotation_changed`,
  /** 视图缩放*/
  SCALE_CHANGED: `${PREFIX}scale_changed`,
  /** 视图渲染完成*/
  IMAGE_RENDERED: `${PREFIX}image_rendered`,
  /** 图像矩阵发生变化 */
  MATRIX_CHANGED: `${PREFIX}matrix_rendered`,
  /** 视图渲染完成后事件派发 */
  RENDER_COMPLETED: `${PREFIX}render_completed`,
};

export const VIEWPORT_CONFIG = {};
