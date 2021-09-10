import { Component } from "@saga/core";
import { API, TOOLVIEW_INTERNAL_EVENTS, View } from "@saga/tools";
import { factory as ViewFactory, VIEWER_INTERNAL_EVENTS } from "@saga/viewer";
import { appendIFrame } from "./utils";
class Viewport extends Component {
  constructor(option) {
    super();
    this.init(option);
    window.a = this;
    this.data = {};
    this.currentIndex = 0;
  }

  async init(option) {
    let opt = Object.assign({}, option, { id: this.id });
    this.option = opt;
    const toolView = new View(opt);
    const api = new API(toolView.id);
    appendIFrame(opt.el, (parent) => {
      // 父容器尺寸发生变化
      const { clientWidth: width, clientHeight: height } = parent;
      imageView?.resize(width, height);
      toolView?.resize(width, height);
    });
    const imageView = ViewFactory(opt);

    imageView.on(VIEWER_INTERNAL_EVENTS.MATRIX_CHANGED, (info) => {
      toolView.updateViewport(info);
      // 更新视图， 根据传来的seriesId, sliceId。
      const sliceKey = `${info.seriesId}-${info.sliceId}`;
      const sliceData = this.data?.[sliceKey] ?? new Map();
      toolView.resetData(sliceData);
    });

    imageView.on(VIEWER_INTERNAL_EVENTS.IMAGE_RENDERED, (info) => {
      toolView.updateImageState(info);
    });

    // 记录上次刷新toolview数据时间，如果时间间隔过短，就不再刷新。从而提升性能
    let lastRenderDataElapsed = Date.now();
    imageView.on(VIEWER_INTERNAL_EVENTS.SLICE_CHANGED, (info) => {
      // 更新视图， 根据传来的seriesId, sliceId。
      this.option.seriesId = info.seriesId;
      const sliceKey = `${info.seriesId}-${info.sliceId}`;
      this.sliceKey = sliceKey;
      const sliceData = this.data?.[sliceKey] ?? new Map();
      const now = Date.now();
      if (now - lastRenderDataElapsed < 100) {
        // 层切换时间间隔太短，不进行数据刷新，避免浪费
        return;
      }

      const { renderer, canvas } = imageView;
      toolView.updateImageState({
        imgCanvas: renderer.renderData,
        canvas,
      });
      toolView.renderData(sliceData);
      lastRenderDataElapsed = now;
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

    [api, toolView].map((obj) => {
      obj.on(TOOLVIEW_INTERNAL_EVENTS.TOOL_ROTATION, (info) => imageView.setRotation(info.rotate, info.dispatch));
      obj.on(TOOLVIEW_INTERNAL_EVENTS.TOOL_WWWC, (info) => imageView.setWWWC(info.wwwc, info.dispatch));
      obj.on(TOOLVIEW_INTERNAL_EVENTS.TOOL_FLIPH, (info) => imageView.setFlipH(info.h, info.dispatch));
      obj.on(TOOLVIEW_INTERNAL_EVENTS.TOOL_FLIPV, (info) => imageView.setFlipV(info.v, info.dispatch));
      obj.on(TOOLVIEW_INTERNAL_EVENTS.TOOL_INVERT, (info) => imageView.setInvert(info.invert, info.dispatch));
      obj.on(TOOLVIEW_INTERNAL_EVENTS.TOOL_SCALE, (info) => imageView.setScale(info.scale, info.dispatch));
      obj.on(TOOLVIEW_INTERNAL_EVENTS.TOOL_TRANSLATE, (info) => imageView.setOffset(info.offset, info.dispatch));
      obj.on(TOOLVIEW_INTERNAL_EVENTS.TOOL_STACK_CHANGE, async (info) => {
        const { delta, loop } = info;
        const { plane, seriesId, resource } = this.option;
        this.currentIndex += delta;
        this.currentIndex = resource.getIllegalIndex(this.currentIndex, seriesId, plane, loop);
        const image = await resource.getImage(seriesId, this.currentIndex, plane);

        imageView.showImage(image);
      });
    });

    this._toolView = toolView;
    this._imageView = imageView;
    this.api = api;
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

  useCmd(type, param, dispatch = true) {
    this.api?.[type](param, dispatch);
  }
}

export default Viewport;
