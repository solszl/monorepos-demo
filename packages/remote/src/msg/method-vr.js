import { MsgTypes } from "./msgTypes";

export const METHODS = {
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
  setOtherVesselVisibility: async function (val) {
    const [route, method] = this._splitMessageType(MsgTypes.VR_OTHER_VESSEL_VISIBILITY);
    const session = this.connection.getSession();
    const data = await session.call(method, [], {
      show_others: val,
    });

    return data;
  },
  setVesselNameMapping: async function (mapping) {
    const [route, method] = this._splitMessageType(MsgTypes.VR_VESSEL_NAME_MAPPING);
    const session = this.connection.getSession();
    const data = await session.call(method, [], {
      vessel_mapping: mapping,
    });

    return data;
  },
  /** 区别于冠脉旧版 */
  setVesselNameVisibility: async function (val) {
    const [route, method] = this._splitMessageType(MsgTypes.VR_VESSEL_TEXT);
    const session = this.connection.getSession();
    const data = await session.call(method, [], {
      add_text: val,
    });
    this.validateNow();
    return data;
  },
  /** VR上血管名称高亮 */
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
