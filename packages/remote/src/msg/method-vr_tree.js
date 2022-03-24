import { MsgTypes } from "./msgTypes";
export const METHODS = {
  setVesselNameMapping: async function (mapping) {
    const [route, method] = this._splitMessageType(MsgTypes.VR_VESSEL_NAME_MAPPING);
    const session = this.connection.getSession();
    const data = await session.call(method, [], {
      vessel_mapping: mapping,
    });

    return data;
  },
};
