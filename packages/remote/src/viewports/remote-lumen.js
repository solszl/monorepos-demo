// import { CombineFrenet } from "../../cpr/frenet";
// import { lps2NearestLocation } from "../../cpr/utils";
import RemoteDicomViewport from "./base/remoteDicomViewport";

class RemoteLumenViewport extends RemoteDicomViewport {
  constructor(options = {}) {
    super(options);
    this.init();
  }

  setTheta(theta) {
    this.displayState.theta = (360 + theta) % 360;
    this.fetchDicom();
  }

  setVesselName(vesselName) {
    this.displayState.vesselName = vesselName;
    this.fetchDicom();
    this.fetchCenterline();
  }

  async fetchDicom() {
    const { vesselName, theta } = this.displayState;
    const { message, direction, httpServer } = this.config;
    let a = Date.now();
    let b = a;
    const uri = await message.lumenDicom(vesselName, theta, direction);
    let c = Date.now() - a;
    a = Date.now();
    const url = `${httpServer}${uri}`;
    await this.setUrl(url);
    let d = Date.now() - a;
    console.log(
      "LUMEN, 一次设置消耗",
      Date.now() - b,
      "请求消耗",
      c,
      "加载图像消耗",
      d,
      vesselName,
      theta
    );
  }

  async fetchCenterline() {
    const { vesselName } = this.displayState;
    const { message, direction } = this.config;
    const centerline2d = await message.lumenCenterline(vesselName, direction);
    this.flatCenterline = centerline2d.reduce((prev, curr) => {
      return prev.concat(...Object.values(curr));
    }, []);

    let obj = {};
    centerline2d.forEach((item, index) => {
      Object.entries(item).forEach(([key, value]) => {
        obj[`${key}_${index}`] = value;
      });
    });

    this.segment = obj;
  }

  set segment(v) {
    this._segment = v;
    if (!this.probePointIndex) {
      this.probePointIndex = 0;
      this.probePoint = this.flatCenterline[0];
      this.probePointNext = this.flatCenterline[1];
    }
  }

  get segment() {
    return this._segment;
  }

  setProbeIndex(i) {
    this.probePointIndex = i;
    this.refresh(true);
  }

  set mapline(val) {
    this._mapline = val;
    // this.combineFrenet = new CombineFrenet(val, "none");
  }

  get mapline() {
    return this._mapline;
  }
}

export default RemoteLumenViewport;
