import { Component } from "@pkg/core/src";
import { API, TOOLVIEW_INTERNAL_EVENTS, View } from "@pkg/tools/src";
import { factory as ViewFactory, VIEWER_INTERNAL_EVENTS } from "@pkg/viewer/src";
import { EVENTS } from "./constants";
import { appendIFrame } from "./utils";
import { snapshotMode1, snapshotMode2 } from "./utils/snapshot";
class Viewport extends Component {
  constructor(option) {
    super();
    this.init(option);
    this.data = {};
    this.currentIndex = 0;
  }

  async init(option) {
    let opt = Object.assign({}, option, { id: this.id });
    this.option = opt;
    const toolView = new View(opt);
    const api = new API(toolView.stage);
    appendIFrame(opt.el, (parent) => {
      // 父容器尺寸发生变化
      const { clientWidth: width, clientHeight: height } = parent;
      imageView?.resize(width, height);
      toolView?.resize(width, height);
    });
    const imageView = ViewFactory(opt);

    imageView.on(VIEWER_INTERNAL_EVENTS.MATRIX_CHANGED, (info) => {
      toolView.updateViewport(info);
      // 更新视图， 根据传来的seriesId, currentIndex
      const sliceKey = `${info.seriesId}-${info.currentIndex}`;
      const sliceData = this.data?.[sliceKey] ?? new Map();
      toolView.resetData(sliceData);
      this.emit(EVENTS.MATRIX_CHANGED, {
        matrix: info,
      });
    });

    imageView.on(VIEWER_INTERNAL_EVENTS.IMAGE_RENDERED, (info) => {
      toolView.updateImageState(info);
      this.emit(EVENTS.IMAGE_RENDERED, {
        imageState: info,
        image: imageView.image,
      });
    });

    // 记录上次刷新toolview数据时间，如果时间间隔过短，就不再刷新。从而提升性能
    let lastRenderDataElapsed = Date.now();
    imageView.on(VIEWER_INTERNAL_EVENTS.SLICE_CHANGED, (info) => {
      // 更新视图， 根据传来的seriesId, currentIndex。
      this.option.seriesId = info.seriesId;
      const sliceKey = `${info.seriesId}-${info.currentIndex}`;
      this.sliceKey = sliceKey;
      this.emit(EVENTS.SLICE_CHANGED, {
        seriesId: info.seriesId,
        currentIndex: this.currentIndex,
        viewportId: this.id,
      });
      const sliceData = this.data?.[sliceKey] ?? new Map();
      const now = Date.now();
      if (now - lastRenderDataElapsed < 50) {
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
      this.emit(EVENTS.TOOL_DATA_UPDATED, data);
    });

    toolView.on(TOOLVIEW_INTERNAL_EVENTS.DATA_REMOVED, (data) => {
      const { sliceKey } = this;
      const sliceData = this.data?.[sliceKey] ?? new Map();
      sliceData.delete(data.id);
      this.data[sliceKey] = sliceData;
      this.emit(EVENTS.TOOL_DATA_REMOVED, data);
    });

    toolView.on(TOOLVIEW_INTERNAL_EVENTS.TOOL_CONTEXTMENU_CLICK, (data) => {
      // console.log(data);
      this.emit(EVENTS.TOOL_DATA_CONTEXTMENU_CLICK, {
        toolId: data.id,
        viewportId: this.id,
        position: data.position,
      });
    });

    [api, toolView].map((obj) => {
      obj.on(TOOLVIEW_INTERNAL_EVENTS.TOOL_ROTATION, (info) =>
        imageView.setRotation(info.rotate, info.dispatch)
      );
      obj.on(TOOLVIEW_INTERNAL_EVENTS.TOOL_WWWC, (info) =>
        imageView.setWWWC(info.wwwc, info.dispatch)
      );
      obj.on(TOOLVIEW_INTERNAL_EVENTS.TOOL_FLIPH, (info) =>
        imageView.setFlipH(info.h, info.dispatch)
      );
      obj.on(TOOLVIEW_INTERNAL_EVENTS.TOOL_FLIPV, (info) =>
        imageView.setFlipV(info.v, info.dispatch)
      );
      obj.on(TOOLVIEW_INTERNAL_EVENTS.TOOL_INVERT, (info) =>
        imageView.setInvert(info.invert, info.dispatch)
      );
      obj.on(TOOLVIEW_INTERNAL_EVENTS.TOOL_SCALE, (info) =>
        imageView.setScale(info.scale, info.dispatch)
      );
      obj.on(TOOLVIEW_INTERNAL_EVENTS.TOOL_TRANSLATE, (info) =>
        imageView.setOffset(info.offset, info.dispatch)
      );
      obj.on(TOOLVIEW_INTERNAL_EVENTS.TOOL_STACK_CHANGE, async (info) => {
        const { delta, loop } = info;
        const { seriesId, resource, transferMode, alias } = this.option;
        const transfer = resource.getTransfer(transferMode);
        this.currentIndex += delta;
        this.currentIndex = transfer.getIllegalIndex(this.currentIndex, seriesId, alias, loop);
        this.showImage(seriesId, this.currentIndex);
      });
      obj.on(TOOLVIEW_INTERNAL_EVENTS.TOOL_SLICE_CHANGE, async (info) => {
        const { seriesId, sliceId, currentIndex, dispatch } = info;
        this.showImage(seriesId, currentIndex, dispatch);
      });

      obj.on(TOOLVIEW_INTERNAL_EVENTS.DATA_CUSTOM_OPERATE, (info) => {
        const { type, seriesId, data } = info;

        data.forEach((d) => {
          const { currentIndex } = d;
          const sliceKey = `${seriesId}-${currentIndex}`;
          const sliceData = this.data?.[sliceKey] ?? new Map();
          switch (type) {
            case "add":
              sliceData.set(d.id, d);
              break;
            case "remove":
              let removeData = sliceData.get(d.id);
              // removeData.remove = true;
              sliceData.set(d.id, { ...removeData, remove: true });
              break;
          }
          this.data[sliceKey] = sliceData;
        });

        const sliceKey = `${seriesId}-${this.currentIndex}`;
        const sliceData = this.data?.[sliceKey] ?? new Map();
        toolView.renderData(sliceData);
      });
    });

    this._toolView = toolView;
    this._imageView = imageView;
    this.api = api;

    const { disableTools = [] } = opt;
    if (Array.isArray(disableTools)) {
      this.disableTools = disableTools;
    } else if (typeof disableTools === "string") {
      this.disableTools = "all";
    }
  }

  get toolView() {
    return this._toolView;
  }

  get imageView() {
    return this._imageView;
  }

  useTool(toolType, button = 1) {
    if (this.disableTools === "all" || this.disableTools.includes(toolType)) {
      return;
    }

    // 默认绑定左键
    this.toolView.useTool(toolType, button);
  }

  useCmd(type, param, dispatch = true) {
    if (this.disableTools === "all" || this.disableTools.includes(type)) {
      return;
    }

    this.api?.[type]?.(param, dispatch);
  }

  /**
   * 根据seriesId,index显示影像数据
   *
   * @param { string } seriesId 影像序列id
   * @param { number } index 影像索引，0开始
   * @memberof Viewport
   */
  async showImage(seriesId, index, dispatch = true) {
    const { resource, transferMode, alias } = this.option;
    const transfer = resource.getTransfer(transferMode);

    this.currentIndex = +index;
    this.currentIndex = transfer.getIllegalIndex(this.currentIndex, seriesId, alias);
    const image = await transfer.getImage(seriesId, this.currentIndex, alias);
    this.imageView.currentShowIndex = this.currentIndex;
    this.imageView.showImage(image, dispatch);
    return image;
  }

  /**
   * 销毁，该销毁方式会将对应的各种数据进行一一清空，包含任务队列，缓存数据，影像dom，工具图层dom等
   * 如果多个viewport共享一套数据，需要考虑一下是否需要完全清空
   *
   * @memberof Viewport
   */
  destroy() {
    this.toolView.destroy();
    this.imageView.destroy();
    this.data = {};
  }

  /**
   * 截图功能，根据配置截图
   * 配置可以有，所见即所得模式，固定模式（根据原图走）
   *
   * @param { Object } config
   * @returns { HTMLCanvasElement } ret
   * @memberof Viewport
   */
  async snapshot(config = {}) {
    let ret = null;
    const { el } = this.option;
    // mode 1: 所见即所得模式， 2：标准影像大小模式
    const { mode = 1, showTypes = [] } = config;
    switch (mode) {
      case 1:
        ret = snapshotMode1(el);
        break;
      case 2:
        const cfg = {
          imageView: this.imageView,
          toolView: this.toolView,
          sliceKey: this.sliceKey,
          data: this.data,
          showTypes,
        };
        ret = snapshotMode2(cfg);
        break;
      default:
        ret = snapshotMode1(el);
        break;
    }

    return ret;
  }
}

export default Viewport;
