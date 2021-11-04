import { Component } from "@pkg/core/src";
import { INTERNAL_EVENTS, TOOL_TYPE } from "../constants";
import { TOOL_CONSTRUCTOR } from "../constructor";
import { useImageInitialState } from "../state/image-state";
import { useViewportInitialState } from "../state/viewport-state";

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

  polygon(params = []) {
    params.forEach((item) => {
      new TOOL_CONSTRUCTOR[TOOL_TYPE.RECT]({ stage: this.stage, ...item });
    });
  }

  reset_cmd(useViewportState = true) {
    const [initialState] = useViewportInitialState(this.stageId);
    const [initialImageState] = useImageInitialState(this.stageId);
    const { rotate, offset, scale } = initialState;
    this.emit(INTERNAL_EVENTS.TOOL_ROTATION, { rotate });
    this.emit(INTERNAL_EVENTS.TOOL_TRANSLATE, { offset });
    this.emit(INTERNAL_EVENTS.TOOL_SCALE, { scale });
    // 如果不适用viewport 的默认属性。则从图里读取
    this.emit(INTERNAL_EVENTS.TOOL_WWWC, useViewportState ?? { wwwc: initialImageState.wwwc });
    this.emit(INTERNAL_EVENTS.TOOL_FLIPH, { h: false });
    this.emit(INTERNAL_EVENTS.TOOL_FLIPV, { v: false });
    this.emit(INTERNAL_EVENTS.TOOL_INVERT, { invert: false });
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
