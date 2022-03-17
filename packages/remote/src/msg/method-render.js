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
  stopMouseInteraction: async function (mouse) {
    const [route, method] = this._splitMessageType(MsgTypes.MOUSE_INTERACTION);
    const session = this.connection.getSession();
    // 需要传入一个当前鼠标的相对的百分比位置
    const data = await session.call(
      method,
      [
        Object.assign(
          {},
          {
            action: "up",
            altKey: false,
            buttonLeft: false,
            buttonMiddle: false,
            buttonRight: false,
            ctrlKey: false,
            metaKey: false,
            shiftKey: false,
            view: -1,
            x: 0.5,
            y: 0.5,
          },
          mouse ?? {}
        ),
      ],
      {}
    );

    return data;
  },
};
