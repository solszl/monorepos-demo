import { CPR_LUMEN_MESSAGE } from "./method-cpr-lumen";
import { MsgTypes } from "./msgTypes";
import { mixin } from "./utils";
class Message {
  constructor() {
    this.connections = new Map();
    mixin(this, CPR_LUMEN_MESSAGE);
  }

  addConnection(route, connection) {
    this.connections.set(route, connection);
  }

  removeConnection(route, disconnect = true) {
    if (disconnect) {
      const conn = this.connections.get(route);
      conn.disconnect();
    }
    this.connections.delete(route);
  }

  getConnection(route) {
    return this.connections.get(route);
  }

  clearAllConnection() {
    this.connections.forEach((conn) => {
      conn.disconnect();
    });

    this.connections.clear();
  }

  /**
   * 获取拉直中线数据
   *
   * @param { string } vesselName
   * @param {string} [direction='portrait' | 'landscape']
   * @memberof Message
   */
  async lumenCenterline(vesselName, direction = "portrait") {
    const [route, method] = this._splitMessageType(MsgTypes.LUMEN_CENTERLINE);
    const { session } = this.getConnection(route);
    const data = await session.call(method, [], {
      vessel_name: vesselName,
      direction,
    });

    return data;
  }

  /**
   * 获取血管拉直的dicom图像
   *
   * @param { string } vesselName 血管名称
   * @param { number } angle 角度
   * @param { string } [direction = 'portrait' | 'landscape'] 方向
   * @memberof Message
   */
  async lumenDicom(vesselName, angle = 0, direction = "portrait") {
    const [route, method] = this._splitMessageType(MsgTypes.LUMEN_DCM);
    const { session } = this.getConnection(route);

    const data = await session.call(method, [], {
      vessel_name: vesselName,
      angle: +angle,
      direction,
    });
    return data;
  }

  /**
   * 获取探针截图位置信息
   *
   * @param { string } vesselName 血管名称
   * @param { number } index 索引
   * @param { number } [count=7] 生成多少张图
   * @param { number } [width=50] 生成图像的宽度
   * @param { number } [height=50] 生成图像的高度
   * @param { number } [ratio=2] 采样精度
   * @memberof Message
   */
  async probeDicom(vesselName, index, count = 7, width = 50, height = 50, ratio = 2) {
    const [route, method] = this._splitMessageType(MsgTypes.PROBE_DCM);
    const { session } = this.getConnection(route);

    const data = await session.call(method, [], {
      vessel_name: vesselName,
      index: +index,
      probe_count: +count,
      width: +width,
      height: +height,
      ratio: +ratio,
    });

    return data;
  }

  /**
   * 获取CPR 拉伸图像及对应平面坐标
   *
   * @param { string } vesselName 血管名称
   * @param { number } theta 角度1
   * @param { number } [phi = 0] 角度2
   * @memberof Message
   */
  async cprDicom(vesselName, theta, phi = 0) {
    const [route, method] = this._splitMessageType(MsgTypes.CPR_DCM);
    const { session } = this.getConnection(route);

    const data = await session.call(method, [], {
      vessel_name: vesselName,
      angle: +theta,
      phi: +phi,
    });

    return data;
  }

  /**
   * 获取轴位图的影像地址
   *
   * @param { number } index
   * @memberof Message
   */
  async axialDicom(index) {
    const [route, method] = this._splitMessageType(MsgTypes.AXIAL_DCM);
    const { session } = this.getConnection(route);

    console.time("axial");
    const data = await session.call(method, [], {
      dcm_num: +index,
    });
    console.timeEnd("axial");
    const url = `http://10.0.50.6:8000${data}`;
    console.log(url);
  }

  /**
   * 设置血管名称显隐
   *
   * @param { Array<string> } vessels
   * @param { Boolean } val
   * @returns
   */
  async setVesselTextVisibility(vessels, val) {
    const call = async (messageType, b) => {
      const [route, method] = this._splitMessageType(messageType);
      const { session } = this.getConnection(route);
      const data = await session.call(method, [], {
        add_text: b,
      });

      return data;
    };

    if (vessels.includes("vr")) {
      await call(MsgTypes.VR_VESSEL_TEXT, val);
    }

    if (vessels.includes("vr_tree")) {
      await call(MsgTypes.VRTREE_VESSEL_TEXT, val);
    }

    if (vessels.includes("mip")) {
      await call(MsgTypes.MIP_VESSEL_TEXT, val);
    }

    return true;
  }

  _splitMessageType(messageType) {
    return messageType.split("|>");
  }
}

export default Message;
