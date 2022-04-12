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

    // prettier-ignore
    const { tracer, id, option:{ plane } } = this;
    const key = tracer.key(id, plane, "getMIPImgCount");
    tracer.mark(key);

    const { total_count } = await session.call(method, [], {
      slice_index: count,
      azimuth_type: azimuth,
    });
    tracer.measure(key, "请求MIP图像数量");
    return total_count;
  },

  /**
   * @param { number } index 目标索引
   * @param { string } azimuth 轴 axial, sagittal, coronal
   * @param { number } count 层数（多少层合一层）
   * @param { boolean } bone 是否带骨
   *
   * @returns 返回dicomImage
   */
  getMipImage: async function (index, azimuth, count, bone) {
    this.azimuth = azimuth;
    this.withBone = bone;
    this.count = count;
    this.currentShowIndex = index;
    const [route, method] = this._splitMessageType(MsgTypes.MIP_GET_DICOM);
    const session = this.connection.getSession();

    // prettier-ignore
    const { tracer, id, option:{ plane } } = this;
    tracer.mark(tracer.key(id, plane, "getMIPImg"));

    const { dcm_path } = await session.call(method, [], {
      with_bone: bone ?? this.withBone ?? true,
      slice_index: index,
      slab_thickness: count ?? this.count ?? 1,
      azimuth_type: azimuth ?? this.azimuth ?? "axial",
    });
    tracer.measure(tracer.key(id, plane, "getMIPImg"), "请求MIP图像数据");

    const { httpServer } = this.option;
    tracer.mark(tracer.key(id, plane, "mipRender"));
    const img = await this.setUrl(`${httpServer}${dcm_path}`);
    return img;
  },
  setVesselNameVisibility: async function (val) {
    const [route, method] = this._splitMessageType(MsgTypes.MIP_VESSEL_TEXT);
    const session = this.connection.getSession();
    const data = await session.call(method, [], {
      add_text: val,
    });
    this.validateNow();
    return data;
  },
};
