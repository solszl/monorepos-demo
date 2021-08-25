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

    imageView.on(VIEWER_INTERNAL_EVENTS.IMAGE_RENDERED, (info) => {
      // console.log(info);
      toolView.updateViewport(info);
    });

    imageView.on(VIEWER_INTERNAL_EVENTS.IMAGE_RENDERED, (info) => {
      toolView.updateViewport(info);
    });

    // 影像大小进行缩放
    imageView.on(VIEWER_INTERNAL_EVENTS.SIZE_CHANGED, (info) => {});

    imageView.on(VIEWER_INTERNAL_EVENTS.ROTATION_CHANGED, (info) => {
      console.log(info);
    });

    imageView.on(VIEWER_INTERNAL_EVENTS.SCALE_CHANGED, (info) => {
      toolView.updateViewport(info);
    });

    imageView.on(VIEWER_INTERNAL_EVENTS.SLICE_CHANGED, (info) => {
      // 更新视图， 根据传来的seriesId, sliceId。
      const sliceKey = `${info.seriesId}-${info.sliceId}`;
      this.sliceKey = sliceKey;
      const sliceData = this.data?.[sliceKey] ?? new Map();
      toolView.renderData(sliceData);
    });

    toolView.on(TOOLVIEW_INTERNAL_EVENTS.DATA_CREATED, (data) => {
      const { sliceKey } = this;
      const sliceData = this.data?.[sliceKey] ?? new Map();
      sliceData.set(data.id, data.data);
      this.data[sliceKey] = sliceData;
    });

    toolView.on(TOOLVIEW_INTERNAL_EVENTS.DATA_UPDATED, (data) => {
      const { sliceKey } = this;
      const sliceData = this.data?.[sliceKey] ?? new Map();
      sliceData.set(data.id, data.data);
      this.data[sliceKey] = sliceData;
    });

    toolView.on(TOOLVIEW_INTERNAL_EVENTS.DATA_REMOVED, (data) => {
      const { sliceKey } = this;
      const sliceData = this.data?.[sliceKey] ?? new Map();
      sliceData.delete(data.id);
      this.data[sliceKey] = sliceData;
    });

    toolView.on(TOOLVIEW_INTERNAL_EVENTS.TOOL_ZOOM, (info) => {});

    toolView.on(TOOLVIEW_INTERNAL_EVENTS.TOOL_TRANSLATE, (info) => {});
    toolView.on(TOOLVIEW_INTERNAL_EVENTS.TOOL_ROTATION, (info) => {
      imageView.setRotation(info.rotate);
    });

    toolView.on(TOOLVIEW_INTERNAL_EVENTS.TOOL_SCALE, (info) => {
      imageView.setScale(info.scale);
    });

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
