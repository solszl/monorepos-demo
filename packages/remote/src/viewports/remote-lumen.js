// import { CombineFrenet } from "../../cpr/frenet";
// import { lps2NearestLocation } from "../../cpr/utils";
import Centerline2DBizz from "../bizz/centerline/centerline-2d";
import { VIEWER_INTERNAL_EVENTS_EXTENDS } from "../constants";
import AbstractRemoteDicomViewport from "./base/abstract-remote-dicom";
class RemoteLumenViewport extends AbstractRemoteDicomViewport {
  constructor(option = {}) {
    super(option);

    // 默认属性
    const { vesselName = "", angle = -1, direction = "portrait", angleStep = 1 } = option;
    this.vesselName = vesselName;
    this.angle = angle;
    this.direction = direction;
    this.angleStep = angleStep;

    // attribute change variables.
    // 角度变更
    this.angleChanged = true;
    // 方向变更
    this.directionChanged = true;
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

  setDirection(dir) {
    if (!["portrait", "landscape"].includes(dir)) {
      console.warn(`doesn't exist direction:${dir}. should in ["portrait", "landscape"]`);
      return;
    }

    if (this.direction === dir) {
      return;
    }

    this.resetDisplayInfo();
    this.directionChanged = true;
    this.direction = dir;
    this.renderSchedule.invalidate(this.propertyChanged, this);
  }

  setVesselName(name) {
    if (!name || this.vesselName === name) {
      return;
    }

    this.resetDisplayInfo();
    this.vesselNameChanged = true;
    this.vesselName = name;
    this.renderSchedule.invalidate(this.propertyChanged, this);
  }

  setAngle(angle) {
    // 保证数据在0~~360
    angle = (angle + 360) % 360 ?? 0;
    if (this.angle === angle) {
      return;
    }

    this.angle = angle;
    this.angleChanged = true;
    this.renderSchedule.invalidate(this.propertyChanged, this);
  }

  getImage(index) {
    super.getImage(index);
    const { angleStep } = this;
    this.setAngle(index * angleStep);
  }

  async propertyChanged() {
    await super.propertyChanged();

    // 请求新的图像
    if (this.directionChanged || this.angleChanged || this.vesselNameChanged) {
      const { vesselName, angle, direction } = this;
      const uri = await this?.getLumenImage(vesselName, angle, direction);

      if (uri === "") {
        console.warn(
          `[lumen] wrong, vessel:${vesselName}, angle:${angle}, direction:${direction}.`
        );
        this.vesselNameChanged = false;
        this.directionChanged = false;
        return false;
      }

      const {
        tracer,
        id,
        option: { httpServer, plane },
      } = this;
      tracer.mark(tracer.key(id, plane, "lumenRender"));
      await this.setUrl(`${httpServer}${uri}`);
      this.angleChanged = false;

      // 方向和名字发生变化的时候，请求新的中线数据
      const linesData = await this?.getLines(vesselName, direction);
      let centerline2d = new Centerline2DBizz();
      centerline2d.setData(linesData);
      this.centerline2d = centerline2d;

      const { centerlineVisibility } = this;
      // 此处不做处理，因为分段信息需要对应的名字
      this.emit(VIEWER_INTERNAL_EVENTS_EXTENDS.CENTERLINE_DATA_CHANGED, {
        viewportId: this.id,
        data: linesData,
        segment: true,
        segmentKeymap: this.keymap,
        direction,
        centerlineVisibility,
        vesselChanged: this.vesselNameChanged,
      });
    }
    this.vesselNameChanged = false;
    this.directionChanged = false;

    // 游标变化
    if (this.currentVernierIndexChanged && this.centerline2d) {
      const { currentVernierIndex, currentVernierChangeWithEvent, centerline2d, id } = this;
      this.emit(VIEWER_INTERNAL_EVENTS_EXTENDS.VERNIER_INDEX_CHANGED, {
        viewportId: id,
        index: currentVernierIndex,
        total: centerline2d.total,
        dispatch: currentVernierChangeWithEvent,
      });
      this.currentVernierIndexChanged = false;
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

  setSegmentVisibility(val) {
    this.emit(VIEWER_INTERNAL_EVENTS_EXTENDS.SEGMENT_STATE_CHANGED, {
      viewportId: this.id,
      state: val,
    });
  }

  setVesselObjKeymap(obj) {
    this.keymap = obj;
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

  /**
   * 由于变更血管名称等，需要重置业务数据
   */
  resetDisplayInfo() {
    this.currentVernierIndex = 0;
    this.currentVernierChangeWithEvent = true;

    this.centerline2d = null;
  }

  async render() {
    await super.render();
    const {
      tracer,
      id,
      option: { plane },
    } = this;
    tracer.measure(tracer.key(id, plane, "lumenRender"), "加载Lumen图像到显示");
    return true;
  }

  _getImageObj() {
    let superObj = super._getImageObj();
    const { angle } = this;
    return {
      ...superObj,
      angle,
      theta: angle,
    };
  }

  static create(option) {
    return new RemoteLumenViewport(option);
  }
}

export default RemoteLumenViewport;
