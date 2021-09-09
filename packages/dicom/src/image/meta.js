import * as dicomParser from "dicom-parser";
import { Tags } from "./tags";
const { DataSet } = dicomParser;
/**
 *
 *
 * @param { DataSet } dataset
 */
export const getMetaData = (dataset) => {
  const pixelSpacing = getNumberValues(dataset, Tags.ImagerPixelSpacing_CT, 2) || getNumberValues(dataset, Tags.ImagerPixelSpacing_CR, 2);

  const metaData = {
    byteArray: dataset.byteArray,
    elements: dataset.elements,
    // 转换格式
    transferSyntax: dataset.string(Tags.TransferSyntaxUID),
    // 一个像素取样点存储时分配到的位数，一般RGB的图像，每一个颜色通道都使用8位，所以一般取值为8。对于灰度图像，如果是256级灰阶，一般就是8位。如果高于256级灰阶，一般就采用16位。
    bitsAllocated: dataset.uint16(Tags.BitsAllocated),
    // 图像的高度
    rows: dataset.uint16(Tags.Rows),
    // 图像的宽度
    columns: dataset.uint16(Tags.Columns),
    // 每一个像素的取样数，一般来说，CT，MR，DR等灰度图像都是1，而彩超等彩**图像都是3，分别表示R, G, B三个颜色通道。
    samplesPerPixel: dataset.uint16(Tags.SamplesperPixel),
    // 像素数据的表现类型 这是一个枚举值，分别为十六进制数0000和0001.
    pixelRepresentation: dataset.uint16(Tags.PixelRepresentation),
    // 当Samples Per Pixel字段的值大于1时，Planar Configuration字段规定了实际像素信息的存储方式
    planarConfiguration: dataset.uint16(Tags.PlanarConfiguration),
    // 像素弹性变换
    pixelAspectRatio: dataset.string(Tags.PixelAspectRatio),
    // 行间距
    rowPixelSpacing: pixelSpacing[0],
    // 列间距
    columnPixelSpacing: pixelSpacing[1],
    // 缩放斜率和截距由硬件制造商决定。
    // 它指定从存储在磁盘表示中的像素到存储在内存表示中的像素的线性转换。磁盘存储的值定义为SV。而转化到内存中的像素值uints就需要两个dicom tag : Rescale intercept和Rescale slope。
    // OutputUnits=m∗SV+b
    // RescaleIntercept:b
    // RescaleSlope:m
    slope: dataset.floatString(Tags.RescaleSlope) || 1,
    intercept: dataset.floatString(Tags.RescaleIntercept) || 0,
    photometricInterpretation: dataset.string(Tags.PhotometricInterpretation),
    invert: dataset.string(Tags.PhotometricInterpretation) === "MONOCHROME1",
    color: dataset.string(Tags.PhotometricInterpretation) === "RGB",
    minPixelValue: dataset.uint16(Tags.SmallestImagePixelValue),
    maxPixelValue: dataset.uint16(Tags.LargestImagePixelValue),
    // 窗位
    windowCenter: getNumberValues(dataset, Tags.WindowCenter, 1)?.[0] || 50,
    // 窗宽
    windowWidth: getNumberValues(dataset, Tags.WindowWidth, 1)?.[0] || 255,
    instanceNumber: dataset.intString(Tags.InstanceNumber),
    imageOrientationPatient: getNumberValues(dataset, Tags.PatientOrientation_CT, 6) || getNumberValues(dataset, Tags.PatientOrientation_CR, 6) || [1, 0, 0, 0, 1, 0],
    imagePositionPatient: getNumberValues(dataset, Tags.PatientPosition_CT, 3) || getNumberValues(dataset, Tags.PatientPosition_CT, 3) || [0, 0, 0],
    sliceThickness: getNumberValue(dataset, Tags.SliceThickness) || 1,
    spacingBetweenSlices: getNumberValue(dataset, Tags.SpacingBetweenSlices),
    imageCompression: getCompressionState({
      lossyImageCompression: dataset.string(Tags.LossyImageCompression),
      lossyImageCompressionRatio: dataset.string(Tags.LossyImageCompressionRatio) | "",
      lossyImageCompressionMethod: dataset.string(Tags.LossyImageCompressionMethod) || "",
    }),
    studyDate: dataset.string(Tags.StudyDate),
    studyTime: dataset.string(Tags.StudyTime),
    seriesNum: dataset.string(Tags.SeriesNumber),
    accessionNumber: dataset.string(Tags.AccessionNumber),
    patientId: dataset.string(Tags.PatientID),
    patientName: stringUTF8(dataset, Tags.PatientName) || "",
    patientSex: dataset.string(Tags.PatientSex) || "",
    patientAge: dataset.string(Tags.PatientAge) || "",
    studyId: dataset.string(Tags.StudyInstanceUID),

    seriesId: dataset.string(Tags.SeriesInstanceUID),
  };

  return metaData;
};

const getNumberValues = (dataset, tag, minimumLength = 0) => {
  const values = [];
  const valueAsString = dataset.string(tag);

  if (!valueAsString) {
    return;
  }
  const split = valueAsString.split("\\");

  if (minimumLength && split.length < minimumLength) {
    return;
  }
  for (let i = 0; i < split.length; i++) {
    values.push(parseFloat(split[i]));
  }

  return values;
};

const getNumberValue = (dataset, tag) => {
  const valueAsString = dataset.string(tag);

  if (!valueAsString) {
    return;
  }

  return parseFloat(valueAsString);
};

const stringUTF8 = (dataset, tag) => {
  var element = dataset.elements[tag];

  if (element && element.length > 0) {
    var codeList = readCodeList(dataset.byteArray, element.dataOffset, element.length);
    const code = codeList.map((item) => "%" + item.toString(16)).join("");
    try {
      return decodeURIComponent(code).trim();
    } catch (e) {
      return;
    }
  }
  return undefined;
};

function readCodeList(byteArray, position, length) {
  if (length < 0) {
    throw new Error("dicomParser.readFixedString - length cannot be less than 0");
  }

  if (position + length > byteArray.length) {
    throw new Error("dicomParser.readFixedString: attempt to read past end of buffer");
  }

  var result = [];
  var byte;

  for (var i = 0; i < length; i++) {
    byte = byteArray[position + i];
    if (byte === 0) {
      position += length;

      return result;
    }
    result.push(byte);
  }

  return result;
}

const getCompressionState = ({ lossyImageCompression, lossyImageCompressionRatio, lossyImageCompressionMethod }) => {
  if (lossyImageCompression === "01" && lossyImageCompressionRatio !== "") {
    const compressionMethod = lossyImageCompressionMethod || "Lossy: ";
    const compressionRatio = parseFloat(lossyImageCompressionRatio).toFixed(2);
    return compressionMethod + " " + compressionRatio + " : 1";
  }
  return "Lossless / Uncompressed";
};
