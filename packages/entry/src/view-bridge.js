import { Component } from "@saga/core";
import { View } from "@saga/tools";
import { factory as ViewFactory, VIEWER_INTERNAL_EVENTS } from "@saga/viewer";
import { TOOLVIEW_INTERNAL_EVENTS } from "@saga/tools";

class Viewport extends Component {
  constructor(option) {
    super();
    this.init(option);
    window.a = this;
    this.data = {};
  }

  async init(option) {
    let opt = Object.assign({}, option, { id: this.id });
    const toolView = new View(opt);
    const imageView = ViewFactory(opt);

    // 父容器尺寸发生变化
    imageView.on(VIEWER_INTERNAL_EVENTS.ROOT_SIZE_CHANGED, (info) => {
      // viewer 尺寸发生变更，同步给toolView
      const { width, height } = info;
      toolView?.resize(width, height);
      console.log("尺寸发生变化了", width, height);
    });

    // 影像位置发生变化（通常发生在拖动的时候）
    imageView.on(VIEWER_INTERNAL_EVENTS.POSITION_CHANGED, (info) => {});

    // 影像大小进行缩放
    imageView.on(VIEWER_INTERNAL_EVENTS.SIZE_CHANGED, (info) => {});

    toolView.on(TOOLVIEW_INTERNAL_EVENTS.DATA_CREATED, (data) => {});
    toolView.on(TOOLVIEW_INTERNAL_EVENTS.DATA_UPDATED, (data) => {});
    toolView.on(TOOLVIEW_INTERNAL_EVENTS.DATA_REMOVED, (id) => {});
    toolView.on(TOOLVIEW_INTERNAL_EVENTS.TOOL_ZOOM, (info) => {});
    toolView.on(TOOLVIEW_INTERNAL_EVENTS.TOOL_TRANSLATE, (info) => {});

    this._toolView = toolView;
    this._imageView = imageView;
  }

  get toolView() {
    return this._toolView;
  }

  get imageView() {
    return this._imageView;
  }

  useTool(toolType, button = 1) {
    // 默认绑定左键
    this.toolView.useTool(toolType, button);
  }
}

export default Viewport;
