import { MsgTypes } from "./msgTypes";
// TODO: dev-0.5版本废除vr_tree命名空间
export const METHODS = {
  /** @deprecated */
  setVesselNameMapping: async function (mapping) {
    const [route, method] = this._splitMessageType(MsgTypes.VR_VESSEL_NAME_MAPPING);
    const session = this.connection.getSession();
    const data = await session.call(method, [], {
      vessel_mapping: mapping,
    });

    return data;
  },
  /** @deprecated */
  setVesselNameVisibility: async function (val) {
    const [route, method] = this._splitMessageType(MsgTypes.VRTREE_VESSEL_TEXT);
    const session = this.connection.getSession();
    const data = await session.call(method, [], {
      add_text: val,
    });
    this.validateNow();
    return data;
  },
  /** @deprecated VR_TREE上血管名称高亮 */
  setVesselHighlight: async function (vessel, mapping = {}) {
    const [route, method] = this._splitMessageType(MsgTypes.VR_TREE_VESSEL_HIGHLIGHT);
    const session = this.connection.getSession();
    const data = await session.call(method, [], {
      vessel_name: vessel,
      vessel_mapping: mapping,
    });
    this.validateNow();
    return data;
  },
  /** @deprecated */
  setOtherVesselVisibility: async function (val) {
    const [route, method] = this._splitMessageType(MsgTypes.VR_TREE_OTHER_VESSEL_VISIBILITY);
    const session = this.connection.getSession();
    const data = await session.call(method, [], {
      show_others: val,
    });
    this.validateNow();
    return data;
  },
};
