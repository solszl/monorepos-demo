import { MsgTypes } from "./msgTypes";
export const METHODS = {
  /**
   *
   * @param { string } azimuth 轴 axial, sagittal, coronal
   * @param { number } count 多少层
   * @returns 这个轴下一共有多少层
   */
  getCount: async function (azimuth, count) {
    const [route, method] = this._splitMessageType(MsgTypes.MIP_GET_COUNT);
    const session = this.connection.getSession();
    const { total_count } = await session.call(method, [], {
      slice_index: count,
      azimuth_type: azimuth,
    });

    return total_count;
  },

  /**
   * @param { number } index 目标索引
   * @param { string } azimuth 轴 axial, sagittal, coronal
   * @param { number } count 层数（多少层合一层）
   * @param { boolean } bone 是否带骨
   */
  getMipImage: async function (index, azimuth, count, bone) {
    this.azimuth = azimuth;
    this.withBone = bone;
    this.count = count;
    this.currentShowIndex = index;
    const [route, method] = this._splitMessageType(MsgTypes.MIP_GET_DICOM);
    const session = this.connection.getSession();
    const { dcm_path } = await session.call(method, [], {
      with_bone: bone ?? this.withBone ?? true,
      slice_index: index,
      slab_thickness: count ?? this.count ?? 1,
      azimuth_type: azimuth ?? this.azimuth ?? "axial",
    });

    const { httpServer } = this.option;
    await this.setUrl(`${httpServer}${dcm_path}`);

    // FIXME: 这里使用的是测试数据。一定要换回去啊
    // const url = `http://10.0.80.32:8887/1.2.840.113619.2.416.2106685279137426449336212617073446717.${
    //   index + 1
    // }`;

    // await this.setUrl(`${url}`);
  },
};
