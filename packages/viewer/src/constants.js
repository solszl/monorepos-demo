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
};
