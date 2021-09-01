const makeTag = (group, element) => {
  return `x${group.toString(16).padStart(4, "0")}${element
    .toString(16)
    .padStart(4, "0")}`;
};

export const Tags = {
  /**
   * DCM图片的图像模式
   *
   * @memberof Tags
   */
  PhotometricInterpretation: makeTag(0x0028, 0x0004),

  /**
   * 图像传输字符串
   *
   * @memberof Tags
   */
  TransferSyntaxUID: makeTag(0x0002, 0x0010),

  /**
   * 给每个像素分配的字节数对应的位数,单字节是8，两个字节是16
   *
   * @memberof Tags
   */
  BitsAllocated: makeTag(0x0028, 0x0100),

  /**
   * 高
   *
   * @memberof Tags
   */
  Rows: makeTag(0x0028, 0x0010),

  /**
   * 宽
   *
   * @memberof Tags
   */
  Columns: makeTag(0x0028, 0x0011),

  /**
   * 通道颜色数量，灰度图通常为1，彩色图为3
   *
   * @memberof Tags
   */
  SamplesperPixel: makeTag(0x0028, 0x0002),

  /**
   * 数据的存储类型，0代表无符号存储，1代表有符号存储
   *
   * @memberof Tags
   */
  PixelRepresentation: makeTag(0x0028, 0x0103),

  /**
   * 彩色图像通道排列方式
   * 0：RGBRGBRGB
   * 1:RRR...GGG...BBB...
   *
   * @memberof Tags
   */
  PlanarConfiguration: makeTag(0x0028, 0x0006),

  /**
   * 像素弹性变换
   *
   * @memberof Tags
   */
  PixelAspectRatio: makeTag(0x0028, 0x0034),

  /**
   * 斜率
   *
   * @memberof Tags
   */
  RescaleSlope: makeTag(0x0028, 0x1053),

  /**
   * 截距
   *
   * @memberof Tags
   */
  RescaleIntercept: makeTag(0x0028, 0x1052),

  /**
   * 最小HU值
   *
   * @memberof Tags
   */
  SmallestImagePixelValue: makeTag(0x0028, 0x0106),

  /**
   * 最大HU值
   *
   * @memberof Tags
   */
  LargestImagePixelValue: makeTag(0x0028, 0x0017),

  /**
   * 窗位
   *
   * @memberof Tags
   */
  WindowCenter: makeTag(0x0028, 0x1050),

  /**
   * 窗宽
   *
   * @memberof Tags
   */
  WindowWidth: makeTag(0x0028, 0x1051),

  /**
   * 图像码、图像唯一序列码
   *
   * @memberof Tags
   */
  InstanceNumber: makeTag(0x0020, 0x0013),

  /**
   * 当该值为1的时候，表明该图像被有损压缩过，计时后来解压缩后，再用非压缩格式存储或者储存，该值也要保持为1
   *
   * @memberof Tags
   */
  LossyImageCompression: makeTag(0x0028, 0x2110),

  /**
   * 压缩率
   *
   * @memberof Tags
   */
  LossyImageCompressionRatio: makeTag(0x0028, 0x2112),

  /**
   * 压缩方法
   *
   * @memberof Tags
   */
  LossyImageCompressionMethod: makeTag(0x0028, 0x2114),

  /**
   * 序列日期
   *
   * @memberof Tags
   */
  StudyDate: makeTag(0x0008, 0x0020),

  /**
   * 检查时间
   *
   * @memberof Tags
   */
  StudyTime: makeTag(0x0008, 0x0030),

  /**
   * 序列号,识别不同检查的号码
   *
   * @memberof Tags
   */
  SeriesNumber: makeTag(0x0020, 0x0011),

  /**
   * RIS的生成序号,用以标识做检查的次序
   *
   * @memberof Tags
   */
  AccessionNumber: makeTag(0x0008, 0x0050),

  /**
   * 病人ID
   *
   * @memberof Tags
   */
  PatientID: makeTag(0x0010, 0x000020),

  /**
   * 病人名字
   *
   * @memberof Tags
   */
  PatientName: makeTag(0x0010, 0x0010),

  /**
   * 病人性别
   *
   * @memberof Tags
   */
  PatientSex: makeTag(0x0010, 0x0040),

  /**
   * 病人年龄
   *
   * @memberof Tags
   */
  PatientAge: makeTag(0x0010, 1010),

  /**
   * CT下的像素间隔
   *
   * @memberof Tags
   */
  ImagerPixelSpacing_CT: makeTag(0x0028, 0x0030),

  /**
   * CR下的像素间隔
   *
   * @memberof Tags
   */
  ImagerPixelSpacing_CR: makeTag(0x0018, 0x1164),

  /**
   * CT下的病人旋转方位
   *
   * @memberof Tags
   */
  PatientOrientation_CT: makeTag(0x0020, 0x0037),

  /**
   * CR下的病人旋转方位
   *
   * @memberof Tags
   */
  PatientOrientation_CR: makeTag(0x0020, 0x0020),

  /**
   * CT下病人位置
   *
   * @memberof Tags
   */
  PatientPosition_CT: makeTag(0x0020, 0x0032),
  /**
   * CR下病人位置
   *
   * @memberof Tags
   */
  PatientPosition_CR: makeTag(0x0018, 0x5100),

  /**
   * 层厚
   *
   * @memberof Tags
   */
  SliceThickness: makeTag(0x0018, 0x0050),

  /**
   * 层间距
   *
   * @memberof Tags
   */
  SpacingBetweenSlices: makeTag(0x0018, 0x0088),

  /**
   * 图像模态 (设备)
   *
   * @memberof Tags
   */
  Modality: makeTag(0x0008, 0x0060),

  /**
   * 检查ID
   *
   * @memberof Tags
   */
  StudyInstanceUID: makeTag(0x0020, 0x000d),

  /**
   * 序列号
   *
   * @memberof Tags
   */
  SeriesInstanceUID: makeTag(0x0020, 0x000e),
};
