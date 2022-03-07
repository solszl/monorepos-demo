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
      const { httpServer } = this.option;
      await this.setUrl(`${httpServer}${uri}`);
      this.angleChanged = false;
    }

    // 方向和名字发生变化的时候，请求新的中线数据
    if (this.directionChanged || this.vesselNameChanged) {
      const { vesselName, direction } = this;
      const linesData = await this?.getLines(vesselName, direction);
      let centerline2d = new Centerline2DBizz();
      centerline2d.setData(linesData);
      this.centerline2d = centerline2d;

      // 如果请求结果还没回来，就设置的索引。 就重新派发一次
      if (this.tempIndex > -1) {
        this.emit(VIEWER_INTERNAL_EVENTS_EXTENDS.VERNIER_INDEX_CHANGED, {
          viewportId: this.id,
          index: this.tempIndex,
          total: centerline2d.total,
        });
        delete this.tempIndex;
      }

      // 此处不做处理，因为分段信息需要对应的名字
      this.emit(VIEWER_INTERNAL_EVENTS_EXTENDS.CENTERLINE_DATA_CHANGED, {
        viewportId: this.id,
        data: linesData,
        segment: true,
        segmentKeymap: this.keymap,
        direction: this.direction,
      });
    }
    this.vesselNameChanged = false;
    this.directionChanged = false;

    // 游标变化
    if (this.currentVernierIndexChanged) {
      const { currentVernierIndex, currentVernierChangeWithEvent, centerline2d, id } = this;
      this.emit(VIEWER_INTERNAL_EVENTS_EXTENDS.VERNIER_INDEX_CHANGED, {
        viewportId: id,
        index: currentVernierIndex,
        total: centerline2d.total,
        dispatch: currentVernierChangeWithEvent,
      });
      this.currentVernierIndexChanged = false;
    }
  }

  setCenterlineVisibility(val) {
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

  // setTheta(theta) {
  //   this.displayState.theta = (360 + theta) % 360;
  //   this.fetchDicom();
  // }

  // setVesselName(vesselName) {
  //   this.displayState.vesselName = vesselName;
  //   this.fetchDicom();
  //   this.fetchCenterline();
  // }

  // async fetchDicom() {
  //   const { vesselName, theta } = this.displayState;
  //   const { message, direction, httpServer } = this.config;
  //   let a = Date.now();
  //   let b = a;
  //   const uri = await message.lumenDicom(vesselName, theta, direction);
  //   let c = Date.now() - a;
  //   a = Date.now();
  //   const url = `${httpServer}${uri}`;
  //   await this.setUrl(url);
  //   let d = Date.now() - a;
  //   console.log(
  //     "LUMEN, 一次设置消耗",
  //     Date.now() - b,
  //     "请求消耗",
  //     c,
  //     "加载图像消耗",
  //     d,
  //     vesselName,
  //     theta
  //   );
  // }

  // async fetchCenterline() {
  //   const { vesselName } = this.displayState;
  //   const { message, direction } = this.config;
  //   const centerline2d = await message.lumenCenterline(vesselName, direction);
  //   this.flatCenterline = centerline2d.reduce((prev, curr) => {
  //     return prev.concat(...Object.values(curr));
  //   }, []);

  //   let obj = {};
  //   centerline2d.forEach((item, index) => {
  //     Object.entries(item).forEach(([key, value]) => {
  //       obj[`${key}_${index}`] = value;
  //     });
  //   });

  //   this.segment = obj;
  // }

  // set segment(v) {
  //   this._segment = v;
  //   if (!this.probePointIndex) {
  //     this.probePointIndex = 0;
  //     this.probePoint = this.flatCenterline[0];
  //     this.probePointNext = this.flatCenterline[1];
  //   }
  // }

  // get segment() {
  //   return this._segment;
  // }

  // setProbeIndex(i) {
  //   this.probePointIndex = i;
  //   this.refresh(true);
  // }

  // set mapline(val) {
  //   this._mapline = val;
  //   // this.combineFrenet = new CombineFrenet(val, "none");
  // }

  // get mapline() {
  //   return this._mapline;
  // }

  static create(option) {
    return new RemoteLumenViewport(option);
  }
}

export default RemoteLumenViewport;
