import { Component } from "@pkg/core/src";
import { VIEWER_INTERNAL_EVENTS_EXTENDS } from "@pkg/remote/src";
import { API, TOOLVIEW_INTERNAL_EVENTS, TOOL_TYPE_EXTENDS, View } from "@pkg/tools/src";
import { factory as ViewFactory, VIEWER_INTERNAL_EVENTS } from "@pkg/viewer/src";
import ResizeObserver from "resize-observer-polyfill";
import { EVENTS } from "./constants";
import { snapshotMode1, snapshotMode2 } from "./utils/snapshot";
class Viewport extends Component {
  constructor(option) {
    super();
    this.option = option;
    this.data = {};
    this.currentIndex = 0;

    this.resizeObserver;

    this.init();
  }

  async init() {
    const { option } = this;
    let opt = Object.assign({}, option, { id: this.id });
    this.option = opt;
    const toolView = new View(opt);
    const api = new API(toolView.stage);
    const imageView = ViewFactory(opt);

    const { el } = opt;
    // 使用一个polyfill, 去除操作dom 添加iframe而引发的性能降低
    this.resizeObserver = new ResizeObserver(() => {
      const { clientWidth: width, clientHeight: height } = el;
      imageView?.resize(width, height);
      toolView?.resize(width, height);
    });

    this.resizeObserver.observe(el);

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

    imageView.on(VIEWER_INTERNAL_EVENTS.RENDER_COMPLETED, (info) => {
      // 不建议监听该事件， 正常来讲，matrix_changed 和 image_rendered 各司其职， 但是业务端同时监听后，无法快速往redux里写数据
      this.emit(EVENTS.RENDER_COMPLETED, info);
    });

    // 记录上次刷新toolview数据时间，如果时间间隔过短，就不再刷新。从而提升性能
    let lastRenderDataElapsed = Date.now();
    imageView.on(VIEWER_INTERNAL_EVENTS.SLICE_CHANGED, (info) => {
      // 更新视图， 根据传来的seriesId, currentIndex。
      this.option.seriesId = info.seriesId;
      const sliceKey = `${info.seriesId}-${info.currentIndex}`;
      this.sliceKey = sliceKey;
      this.currentIndex = info.currentIndex;
      this.emit(EVENTS.SLICE_CHANGED, {
        seriesId: info.seriesId,
        currentIndex: info.currentIndex,
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

      toolView.autofit();
      toolView.renderData(sliceData);
      lastRenderDataElapsed = now;
    });

    imageView.on(VIEWER_INTERNAL_EVENTS_EXTENDS.CENTERLINE_STATE_CHANGED, (info) => {
      const { state } = info;
      toolView.updateData({
        layerId: "staticLayer",
        toolId: "centerline2d",
        props: {
          visible: state,
        },
      });
    });

    imageView.on(VIEWER_INTERNAL_EVENTS_EXTENDS.SEGMENT_STATE_CHANGED, (info) => {
      // TODO: 分段信息显隐控制
    });

    imageView.on(VIEWER_INTERNAL_EVENTS_EXTENDS.CENTERLINE_DATA_CHANGED, (info) => {
      const { viewportId, data, segment } = info;
      console.log("中线数据发生变更", data, segment);
      if (viewportId !== this.id) {
        return;
      }

      // toolView.clearLayer("staticLayer");
      // 设置中线数据
      toolView.renderStaticData({
        type: TOOL_TYPE_EXTENDS.CENTERLINE2D,
        toolId: "centerline2d",
        data,
      });
      // 设置分段信息数据
      if (segment) {
        const {
          direction,
          renderer: { renderData },
        } = imageView;

        const { segmentKeymap } = info;
        toolView.renderStaticData({
          type: TOOL_TYPE_EXTENDS.VESSEL_SEGMENT,
          data,
          keymap: segmentKeymap,
          direction: direction,
          size: imageView.direction === "landscape" ? renderData.width : renderData.height,
        });
      }

      const { tags, highlightTag, flatData } = info;
      if (tags) {
        toolView.renderStaticData({
          type: TOOL_TYPE_EXTENDS.TAG_GROUP,
          toolId: "tagGroup",
          tags,
          highlightTag,
          path: flatData,
        });
      }
    });

    imageView.on(VIEWER_INTERNAL_EVENTS_EXTENDS.VERNIER_INDEX_CHANGED, (info) => {
      const { index, total, viewportId, dispatch } = info;
      toolView.updateData({
        layerId: "staticLayer",
        toolId: "centerline2d",
        props: {
          vernierIndex: index,
        },
      });

      if (dispatch) {
        this.emit(EVENTS.VERNIER_INDEX_CHANGED, {
          viewportId,
          index,
          total,
        });
      }
    });

    imageView.on(VIEWER_INTERNAL_EVENTS_EXTENDS.SEGMENT_DATA_CHANGED, (info) => {
      const { viewportId, data } = info;
      console.log("中线数据发生变更", this.id, viewportId);
      if (viewportId !== this.id) {
        return;
      }

      // 设置分段
    });

    imageView.on(VIEWER_INTERNAL_EVENTS_EXTENDS.VESSEL_KEYMAP_CHANGED, (info) => {
      const { keymap } = info;
      toolView.updateData({
        layerId: "staticLayer",
        toolId: "segment",
        props: {
          keymap,
        },
      });
    });

    imageView.on(VIEWER_INTERNAL_EVENTS_EXTENDS.CPR_TAGS_CHANGED, (info) => {
      // CPR tag 更新
    });

    imageView.on(VIEWER_INTERNAL_EVENTS_EXTENDS.CPR_HIGHLIGHT_CHANGED, (tag) => {
      // cpr 高亮某个tag
    });
    imageView.on(VIEWER_INTERNAL_EVENTS_EXTENDS.CPR_TAGS_STATE_CHANGED, (info) => {
      const { state } = info;
      // cpr 隐藏所有tags
      toolView.updateData({
        layerId: "staticLayer",
        toolId: "tagGroup",
        props: {
          visible: state,
        },
      });
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
        type: data.toolType,
      });
    });

    toolView.on(TOOLVIEW_INTERNAL_EVENTS.VERNIER_INDEX_CHANGED, (data) => {
      const { index, total } = data;
      this.emit(EVENTS.VERNIER_INDEX_CHANGED, {
        viewportId: this.id,
        index,
        total,
      });
    });

    toolView.on(TOOLVIEW_INTERNAL_EVENTS.TAG_STATE_CHANGED, (data) => {
      const { data: info } = data;
      this.emit(EVENTS.TAG_STATE_CHANGED, {
        viewportId: this.id,
        info,
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
      obj.on(TOOLVIEW_INTERNAL_EVENTS.TOOL_SCALE, (info) => {
        imageView.setScale(info.scale, info.dispatch);
      });
      obj.on(TOOLVIEW_INTERNAL_EVENTS.TOOL_SCALE_FIT, (info) => {
        const { rootWidth, rootHeight } = info;
        imageView.resize(rootWidth, rootHeight);
        // 当舞台尺寸发生变化的时候， 要手动更新一下舞台大小
        toolView.manualOverwriteViewportInitialState({ rootWidth, rootHeight });
      });
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
          const { currentIndex, id } = d;
          const sliceKey = `${seriesId}-${currentIndex}`;
          const sliceData = this.data?.[sliceKey] ?? new Map();
          switch (type) {
            case "add":
              sliceData.set(id, d);
              break;
            case "remove":
              sliceData.delete(id);
              toolView.emit(TOOLVIEW_INTERNAL_EVENTS.DATA_REMOVED, { id });
              break;
          }
          this.data[sliceKey] = sliceData;
        });

        const sliceKey = `${seriesId}-${this.currentIndex}`;
        const sliceData = this.data?.[sliceKey] ?? new Map();
        toolView.renderData(sliceData);
      });

      obj.on(TOOLVIEW_INTERNAL_EVENTS.REMOVE_SPECIFIED_DATA, (info) => {
        const { types } = info;
        Object.keys(this.data).forEach((key) => {
          const sliceData = this.data[key];
          sliceData.forEach((data, key, currentSliceData) => {
            if (!types.includes(data.type)) {
              currentSliceData.delete(key);
            }
          });

          if (sliceData.size === 0) {
            delete this.data[key];
          }
        });

        const sliceKey = `${this.option.seriesId}-${this.currentIndex}`;
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
    this.imageView.currentShowIndex = this.currentIndex;

    let image;
    // 如果是多种transfer情况下，分别处理
    if (transferMode === "web") {
      image = await transfer.getImage(seriesId, this.currentIndex, alias);
      this.imageView.showImage(image, dispatch);
    } else if (transferMode === "socket") {
      // get && show
      this.imageView.getImage(index);
    } else {
    }
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
    this?.resizeObserver.disconnect();
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
