import { Component } from "@pkg/core/src";
import { INTERNAL_EVENTS, TOOL_TYPE } from "../constants";
import { TOOL_CONSTRUCTOR } from "../constructor";
import { useImageInitialState, useImageState } from "../state/image-state";
import { removeViewportState, useViewportInitialState } from "../state/viewport-state";

class API extends Component {
  constructor(stage) {
    super();
    this.playInterval = null;
    this.stageId = stage.id();
    this.stage = stage;
  }

  rotation_cmd(rotate, dispatch = true) {
    this.emit(INTERNAL_EVENTS.TOOL_ROTATION, { rotate, dispatch });
  }

  wwwc_cmd(wwwc, dispatch = true) {
    this.emit(INTERNAL_EVENTS.TOOL_WWWC, { wwwc, dispatch });
  }

  translate_cmd(offset, dispatch = true) {
    this.emit(INTERNAL_EVENTS.TOOL_TRANSLATE, { offset, dispatch });
  }

  flip_h_cmd(h, dispatch = true) {
    this.emit(INTERNAL_EVENTS.TOOL_FLIPH, { h, dispatch });
  }

  flip_v_cmd(v, dispatch = true) {
    this.emit(INTERNAL_EVENTS.TOOL_FLIPV, { v, dispatch });
  }

  invert_cmd(invert, dispatch = true) {
    this.emit(INTERNAL_EVENTS.TOOL_INVERT, { invert, dispatch });
  }

  scale_cmd(scale, dispatch = true) {
    this.emit(INTERNAL_EVENTS.TOOL_SCALE, { scale, dispatch });
  }

  slice_cmd(data, dispatch = true) {
    const { seriesId, sliceId, currentIndex } = data;
    this.emit(INTERNAL_EVENTS.TOOL_SLICE_CHANGE, { seriesId, sliceId, currentIndex, dispatch });
  }

  polygon(params = []) {
    params.forEach((item) => {
      new TOOL_CONSTRUCTOR[TOOL_TYPE.RECT]({ stage: this.stage, ...item });
    });
  }

  data_cmd(params, dispatch = true) {
    const { type, data, seriesId } = params;
    this.emit(INTERNAL_EVENTS.DATA_CUSTOM_OPERATE, { type, data, seriesId, dispatch });
  }

  reset_cmd(params, dispatch = true) {
    const { viewportProperties, toolProperties = [] } = params;
    const [initialState] = useViewportInitialState(this.stageId);
    const [initialImageState] = useImageInitialState(this.stageId);
    const { rotate, offset, scale, rootWidth, rootHeight } = initialState;

    const {
      rotate: v_rotate,
      offset: v_offset,
      scale: v_scale,
      wwwc: v_wwwc,
      h: v_h,
      v: v_v,
      invert: v_invert,
    } = viewportProperties;

    this.emit(INTERNAL_EVENTS.TOOL_ROTATION, { rotate: v_rotate ? v_rotate?.value : rotate });
    this.emit(INTERNAL_EVENTS.TOOL_TRANSLATE, { offset: v_offset ? v_offset?.value : offset });
    if (v_scale) {
      this.emit(INTERNAL_EVENTS.TOOL_SCALE, { scale: v_scale ? v_scale?.value : scale });
    } else {
      const rootWidth = this.stage.width();
      const rootHeight = this.stage.height();
      this.emit(INTERNAL_EVENTS.TOOL_SCALE_FIT, {
        rootWidth,
        rootHeight,
      });
    }

    const getWWWC = (val) => {
      const [getImageState] = useImageState(this.stageId);
      const { initialWWWC, wwwc, imageOriginWWWC } = getImageState();
      // 1 现在正在呈现的，2，dicom标签上的 3，addViewport时设置的
      switch (val) {
        case 1:
          return wwwc;
        case 2:
          return imageOriginWWWC;
        case 3:
          return initialWWWC ?? wwwc;
        default:
          return imageOriginWWWC;
      }
    };
    this.emit(INTERNAL_EVENTS.TOOL_WWWC, {
      wwwc: v_wwwc ? getWWWC(v_wwwc?.value) : initialImageState.wwwc,
    });

    this.emit(INTERNAL_EVENTS.TOOL_FLIPH, { h: v_h ? v_h?.value : false });
    this.emit(INTERNAL_EVENTS.TOOL_FLIPV, { v: v_v ? v_v?.value : false });
    this.emit(INTERNAL_EVENTS.TOOL_INVERT, { invert: v_invert ? v_invert?.value : false });

    // toolProperties = ['roi', 'length'] 保留这些类型数据
    this.emit(INTERNAL_EVENTS.REMOVE_SPECIFIED_DATA, { types: toolProperties });
  }

  remove_viewport_state_cmd() {
    removeViewportState(this.stageId);
  }

  /**
   *  默认以basis 毫秒播放一张图
   * 例1：设置 play_cmd(1,1000)  以1秒切一张图的速度进行1倍速播放, 实际切图间隔为1000ms
   * 例2：设置 play_cmd(2,500) 以500毫秒切一张图的速度进行2倍播放，实际切图间隔为250ms
   *
   * @param { number } speed 播放速度倍数
   * @param {number} [basis=1000] 时间间隔基数
   * @memberof API
   */
  play_cmd(speed, basis = 1000) {
    clearInterval(this.playInterval);
    const s = Math.max(0.25, Math.min(speed, 5));
    this.playInterval = setInterval(() => {
      this.emit(INTERNAL_EVENTS.TOOL_STACK_CHANGE, { delta: 1, loop: true });
    }, basis / s);
  }

  stop_cmd() {
    clearInterval(this.playInterval);
  }
}
export default API;
