import { MsgTypes } from "./msgTypes";

export const METHODS = {
  /**
   * 调用服务端渲染，切换模型
   * 0: "neckBloodVesselVR"
   * 1: "neckBloodVesselVMIP"
   * 2: "neckBloodVesselInverseVMIP"
   * 3: "willisVR"
   * 4: "willisVMIP"
   * 5: "intracranialVascularVR"
   * 6: "intracranialVascularVMIP"
   * 7: "intracranialVascularInverseVMIP"
   * 8: "anteriorCirculationVR"
   * 9: "posteriorCirculationVR"
   * 10: "posteriorCirculationVMIP"
   * 11: "anteriorCirculationVMIP"
   * 12: "cerebralWithBoneVR"
   * @param { string } 需要渲染的名称
   */
  setShowType: async function (type) {
    const call = async (messageType, val) => {
      const [route, method] = this._splitMessageType(messageType);
      const session = this.connection.getSession();
      const data = await session.call(method, [], {
        render_type: val,
      });

      return data;
    };

    await call(MsgTypes.RENDER_TYPE_TOGGLE, type);
    this.validateNow();
    return true;
  },
};
