import { MsgTypes } from "./msgTypes";
export const METHODS = {
  getLines: async function (vesselName, direction) {
    const [route, method] = this._splitMessageType(MsgTypes.LUMEN_CENTERLINE);
    const session = this.connection.getSession();

    const data = await session.call(method, [], {
      vessel_name: vesselName,
      direction,
    });

    return data;
  },
  getLumenImage: async function (vesselName, angle, direction) {
    const [route, method] = this._splitMessageType(MsgTypes.LUMEN_DCM);
    const session = this.connection.getSession();

    const data = await session.call(method, [], {
      vessel_name: vesselName,
      angle,
      direction,
    });

    return data;
  },
  getCprImage: async function (vesselName, theta, phi) {
    const [route, method] = this._splitMessageType(MsgTypes.CPR_DCM);
    const session = this.connection.getSession();

    const { plane_line, dcm_path } = await session.call(method, [], {
      vessel_name: vesselName,
      angle: theta,
      phi,
    });

    return {
      centerline: plane_line,
      uri: dcm_path,
    };
  },
  getProbeImage: async function (vesselName, index, count = 1, width = 30, height = 30, ratio = 2) {
    const [route, method] = this._splitMessageType(MsgTypes.PROBE_DCM);
    const session = this.connection.getSession();

    const data = await session.call(method, [], {
      vessel_name: vesselName,
      index,
      probe_count: count,
      width,
      height,
      ratio,
    });

    return data;
  },
};
