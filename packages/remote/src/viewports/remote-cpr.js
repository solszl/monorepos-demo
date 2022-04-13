/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
// import { CombineFrenet } from "../../cpr/frenet";
// import { lps2NearestLocation } from "../../cpr/utils";
import Centerline2DBizz from "../bizz/centerline/centerline-2d";
import { VIEWER_INTERNAL_EVENTS_EXTENDS } from "../constants";
import AbstractRemoteDicomViewport from "./base/abstract-remote-dicom";
class RemoteCPRViewport extends AbstractRemoteDicomViewport {
  constructor(option = {}) {
    super(option);

    const { vesselName = "", theta = -1, phi = 0, angleStep = 1 } = option;
    this.vesselName = vesselName;
    this.theta = theta;
    this.phi = phi;
    this.angleStep = angleStep;

    this._needCalcSize = false;
  }

  async initialAsyncWorkflow() {
    const { route } = this.option;
    await this.mixinMethods(route);
  }

  async mixinMethods(route) {
    super.mixinMethods(route);

    // 动态引入函数列表 进行mixin操作
    const { METHODS } = await import(`./../msg/method-${route}`);
    Object.entries(METHODS).forEach(([key, value]) => {
      Reflect.set(this, key, value.bind(this));
    });
  }

  setVesselName(name) {
    if (this.vesselName === name) {
      return;
    }

    this.vesselName = name;
    this.vesselNameChanged = true;
    this._needCalcSize = true;
    this.displayState.offset = { x: 0, y: 0 };

    this.resetDisplayInfo();
    this.renderSchedule.invalidate(this.propertyChanged, this);
  }

  /** alias for theta */
  setAngle(val) {
    this.setTheta(val);
  }

  setTheta(theta) {
    theta = (theta + 360) % 360;
    if (this.theta === theta) {
      return;
    }

    this.theta = theta;
    this.angle = theta;
    this.angleChanged = true;
    this.renderSchedule.invalidate(this.propertyChanged, this);
  }

  setPhi(phi) {
    phi = (phi + 360) % 360;
    if (this.phi === phi) {
      return;
    }

    this.phi = phi;
    this.angleChanged = true;
    this.renderSchedule.invalidate(this.propertyChanged, this);
  }

  getImage(index) {
    super.getImage(index);
    const { angleStep } = this;
    this.setTheta(index * angleStep);
  }

  async propertyChanged() {
    await super.propertyChanged();
    if (this.vesselNameChanged || this.angleChanged) {
      const { vesselName, theta, phi } = this;
      const { centerline = [], uri } = await this?.getCprImage(vesselName, theta, phi);

      if (centerline.length === 0 || uri === "") {
        console.warn(`[cpr] wrong, vessel:${vesselName}, theta:${theta}, phi:${phi}.`);
        this.vesselNameChanged = false;
        this.angleChanged = false;
        return false;
      }
      // 2d中线逻辑
      const centerline2d = new Centerline2DBizz();
      centerline2d.setData(centerline);
      this.centerline2d = centerline2d;
      const { tags, highlightTag, tagsVisibility, centerlineVisibility } = this;
      this.emit(VIEWER_INTERNAL_EVENTS_EXTENDS.CENTERLINE_DATA_CHANGED, {
        viewportId: this.id,
        data: centerline,
        flatData: centerline2d.path,
        tags,
        highlightTag,
        tagsVisibility,
        centerlineVisibility,
        vesselChanged: this.vesselNameChanged,
      });

      const { tracer, id } = this;
      //设置图像
      const { httpServer, plane } = this.option;

      tracer.mark(tracer.key(id, plane, "cprRender"));
      await this.setUrl(`${httpServer}${uri}`);

      // 设置中线
      this.vesselNameChanged = false;
      this.angleChanged = false;
    }

    // 游标变化
    if (this.currentVernierIndexChanged) {
      const {
        currentVernierIndex,
        currentVernierChangeWithEvent,
        centerline2d,
        id: viewportId,
      } = this;

      this.emit(VIEWER_INTERNAL_EVENTS_EXTENDS.VERNIER_INDEX_CHANGED, {
        viewportId,
        index: currentVernierIndex,
        total: centerline2d.total,
        dispatch: currentVernierChangeWithEvent,
      });

      this.currentVernierIndexChanged = false;
    }

    if (this.tagsChanged) {
      const { tags, id: viewportId } = this;
      this.emit(VIEWER_INTERNAL_EVENTS_EXTENDS.CPR_TAGS_CHANGED, {
        viewportId,
        tags,
      });

      this.tagsChanged = false;
    }

    if (this.highlightTagChanged) {
      const { highlightTag } = this;
      this.emit(VIEWER_INTERNAL_EVENTS_EXTENDS.CPR_HIGHLIGHT_CHANGED, {
        viewportId: this.id,
        highlight: highlightTag,
      });

      this.highlightTagChanged = false;
    }

    return true;
  }

  setCenterlineVisibility(val) {
    this.centerlineVisibility = val;
    this.emit(VIEWER_INTERNAL_EVENTS_EXTENDS.CENTERLINE_STATE_CHANGED, {
      viewportId: this.id,
      state: val,
    });
  }

  setVesselObjKeymap(obj) {
    this.emit(VIEWER_INTERNAL_EVENTS_EXTENDS.VESSEL_KEYMAP_CHANGED, {
      viewportId: this.id,
      keymap: obj,
    });
  }

  setVernierIndex(index, withEvent = true) {
    if (this.currentVernierIndex === index) {
      return;
    }

    this.currentVernierIndex = index;
    this.currentVernierChangeWithEvent = withEvent;
    this.currentVernierIndexChanged = true;
    this.renderSchedule.invalidate(this.propertyChanged, this);
  }

  setTags(obj) {
    this.tags = obj;
    this.tagsChanged = true;
    this.renderSchedule.invalidate(this.propertyChanged, this);
  }

  setHighlightTag(obj) {
    this.highlightTag = obj;
    this.highlightTagChanged = true;
    this.renderSchedule.invalidate(this.propertyChanged, this);
  }

  setTagsVisibility(val) {
    this.tagsVisibility = val;
    this.emit(VIEWER_INTERNAL_EVENTS_EXTENDS.CPR_TAGS_STATE_CHANGED, {
      viewportId: this.id,
      state: val,
    });
  }

  showImage(image, dispatch = true) {
    super.showImage(image, dispatch);
    this._needCalcSize = false;
  }

  async render() {
    const {
      tracer,
      id,
      option: { plane },
    } = this;

    await super.render();
    tracer.measure(tracer.key(id, plane, "cprRender"), "加载CPR图像到显示");
    return true;
  }

  /**
   * 由于变更血管名称等，需要重置业务数据
   */
  resetDisplayInfo() {
    this.currentVernierIndex = 0;
    this.currentVernierChangeWithEvent = true;

    this.tags = {};
    this.centerline2d = null;
  }

  _getImageObj() {
    let superObj = super._getImageObj();
    const { theta, phi } = this;
    return {
      ...superObj,
      angle: theta,
      theta,
      phi,
    };
  }

  static create(option) {
    return new RemoteCPRViewport(option);
  }
}

export default RemoteCPRViewport;
