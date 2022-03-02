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

    const { vesselName = "", theta = -1, phi = -1, angleStep = 1 } = option;
    this.vesselName = vesselName;
    this.theta = theta;
    this.phi = phi;
    this.angleStep = angleStep;
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
      const { centerline, uri } = await this?.getCprImage(vesselName, theta, phi);
      // 2d中线逻辑
      const centerline2d = new Centerline2DBizz();
      centerline2d.setData(centerline);
      this.centerline2d = centerline2d;
      this.emit(VIEWER_INTERNAL_EVENTS_EXTENDS.CENTERLINE_DATA_CHANGED, {
        viewportId: this.id,
        data: centerline,
        segment: false,
      });

      //设置图像
      const { httpServer } = this.option;
      await this.setUrl(`${httpServer}${uri}`);

      // 设置中线
      this.vesselNameChanged = false;
      this.angleChanged = false;
    }
  }

  setCenterlineVisibility(val) {
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

  setVernierIndex(index) {
    const { centerline2d } = this;
    this.emit(VIEWER_INTERNAL_EVENTS_EXTENDS.VERNIER_INDEX_CHANGED, {
      viewportId: this.id,
      index,
      total: centerline2d.total,
    });
  }

  // setTheta(theta) {
  //   this.displayState.theta = (360 + theta) % 360;
  //   this.fetchDicom();
  // }

  // setPhi(phi) {
  //   this.displayState.phi = (360 + phi) % 360;
  //   this.fetchDicom();
  // }

  // setVesselName(vesselName) {
  //   this.displayState.vesselName = vesselName;
  //   this.fetchDicom();
  // }

  // async fetchDicom() {
  //   const { vesselName, theta, phi = 0 } = this.displayState;
  //   const { message, httpServer } = this.config;
  //   let a = Date.now();
  //   let b = a;
  //   const { dcm_path, plane_line } = await message.cprDicom(vesselName, theta, phi);
  //   this.flatCenterline = plane_line;
  //   this.segment = { seg: plane_line }; // 兼容历史数据 保存成对象 seg 随便起的，centerline2d 不关心key
  //   let c = Date.now() - a;
  //   a = Date.now();
  //   const url = `${httpServer}${dcm_path}`;
  //   await this.setUrl(url);
  //   let d = Date.now() - a;
  //   console.log(
  //     "CPR, 一次设置消耗",
  //     Date.now() - b,
  //     "请求消耗",
  //     c,
  //     "加载图像消耗",
  //     d,
  //     vesselName,
  //     theta
  //   );
  // }

  // set segment(v) {
  //   this._segment = v;
  //   if (!this.probePointIndex) {
  //     this.probePointIndex = 0; // [Object.keys(v)[0], 0];
  //     this.probePoint = this.flatCenterline[0]; // v[Object.keys(v)[0]][0];
  //     this.probePointNext = this.flatCenterline[1]; // v[Object.keys(v)[0]][1];
  //   }
  // }

  // get segment() {
  //   return this._segment;
  // }

  // set mapline(val) {
  //   this._mapline = val;
  //   // this.combineFrenet = new CombineFrenet(val, "none");
  // }

  // get mapline() {
  //   return this._mapline;
  // }

  // setLocProbeIndex(k, i) {
  //   // this.probePointIndex = [k, i];
  //   // this.refresh();
  // }

  // // 从老代码里粘贴过来， 为了兼容
  // getIJKCoords(coords) {
  //   if (!this.combineFrenet) {
  //     return;
  //   }
  //   let loc = lps2NearestLocation(this.combineFrenet.points, coords);
  //   let key = null;
  //   let i = null;
  //   let index = 0;
  //   for (let [k, v] of Object.entries(this.segment)) {
  //     loc -= v.length;
  //     if (loc < 0) {
  //       key = k;
  //       i = v.length + loc - index;
  //       i = Math.max(0, i);
  //       break;
  //     }
  //     index++;
  //   }
  //   let point = this.segment[key][i];
  //   return this.transform.transformPoint(point[0], point[1]);
  // }

  // setProbeIndex(i) {
  //   this.probePointIndex = i;
  //   const { flatCenterline } = this;
  //   this.probePoint = flatCenterline[i];
  //   this.probePointNext = flatCenterline[Math.min(i + 1, flatCenterline.length)];
  //   this.refresh(true);
  // }

  static create(option) {
    return new RemoteCPRViewport(option);
  }
}

export default RemoteCPRViewport;
