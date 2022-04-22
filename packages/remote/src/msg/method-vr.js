import { MsgTypes } from "./msgTypes";
// TODO: dev-0.5版本废除vr命名空间
export const METHODS = {
  /** @deprecated */
  setVesselTextVisibility: async function (vessels, val) {
    const call = async (messageType, b) => {
      const [route, method] = this._splitMessageType(messageType);
      const session = this.connection.getSession();
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

    this.validateNow();
    return true;
  },
  /** @deprecated */
  setOtherVesselVisibility: async function (val) {
    const [route, method] = this._splitMessageType(MsgTypes.VR_OTHER_VESSEL_VISIBILITY);
    const session = this.connection.getSession();
    const data = await session.call(method, [], {
      show_others: val,
    });

    this.validateNow();
    return data;
  },
  /** @deprecated */
  setVesselNameMapping: async function (mapping) {
    const [route, method] = this._splitMessageType(MsgTypes.VR_VESSEL_NAME_MAPPING);
    const session = this.connection.getSession();
    const data = await session.call(method, [], {
      vessel_mapping: mapping,
    });

    this.validateNow();
    return data;
  },
  /** @deprecated 区别于冠脉旧版 */
  setVesselNameVisibility: async function (val) {
    const [route, method] = this._splitMessageType(MsgTypes.VR_VESSEL_TEXT);
    const session = this.connection.getSession();
    const data = await session.call(method, [], {
      add_text: val,
    });
    this.validateNow();
    return data;
  },
  /** @deprecated VR上血管名称高亮 */
  setVesselHighlight: async function (vessel, mapping = {}) {
    const [route, method] = this._splitMessageType(MsgTypes.VR_VESSEL_HIGHLIGHT);
    const session = this.connection.getSession();
    const data = await session.call(method, [], {
      vessel_name: vessel,
      vessel_mapping: mapping,
    });
    this.validateNow();
    return data;
  },
};
