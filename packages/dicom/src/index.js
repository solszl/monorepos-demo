import * as DicomParser from "dicom-parser";
import { decode } from "./image/decode";
import { dump } from "./image/dump";
import { getMetaData } from "./image/meta";
import { getPixelData } from "./image/pixel";

const getDataset = (arraybuffer) => {
  const byteArray = new Uint8Array(arraybuffer);
  return DicomParser.parseDicom(byteArray);
};

const updateMetaForPixelData = async (meta, pixelDataSource) => {
  let result = null;
  const { transferSyntax } = meta;
  switch (transferSyntax) {
    // Implicit VR Little Endian
    case "1.2.840.10008.1.2":
    // Explicit VR Little Endian
    case "1.2.840.10008.1.2.1":
    // Explicit VR Big Endian (retired)
    case "1.2.840.10008.1.2.2":
    // Deflate transfer syntax (deflated by dicomParser)
    case "1.2.840.10008.1.2.1.99":
    // RLE Lossless
    case "1.2.840.10008.1.2.5":
    // JPEG-LS Lossless Image Compression
    case "1.2.840.10008.1.2.4.80":
      result = await decode(meta, pixelDataSource);
      break;
    default:
      result = new Promise((resolve, reject) => {
        reject(new Error(`No decoder for transfer syntax:${transferSyntax}`));
      });
  }

  return result;
};

const postprocess = (meta) => {
  meta.sizeInBytes = meta.pixelData.byteLength;
  if (!meta.minPixelValue || !meta.maxPixelValue) {
    const { min, max } = getMinMaxValues(meta.pixelData);
    meta.minPixelValue = min;
    meta.maxPixelValue = max;
  }

  delete meta.elements;
  delete meta.byteArray;
  return meta;
};

const getMinMaxValues = (pixelData) => {
  let min = Number.MAX_SAFE_INTEGER;
  let max = Number.MIN_SAFE_INTEGER;
  const len = pixelData.length;
  let i = 0;
  let pixel;
  while (i < len) {
    pixel = pixelData[i];
    min = Math.min(min, pixel);
    max = Math.max(max, pixel);
    i += 1;
  }

  return { min, max };
};

let dumpTags = null;
export const createImage = async (arrayBuffer) => {
  const dataset = getDataset(arrayBuffer);
  if (!dumpTags) {
    dumpTags = dump(dataset); // 1ms 以内
  }
  let meta = getMetaData(dataset);
  const pixelDataSource = getPixelData(dataset, meta);
  meta = await updateMetaForPixelData(meta, pixelDataSource);
  return postprocess(meta);
};

export const createWebImage = async (arrayBuffer) => {
  const img = {
    data: arrayBuffer,
  };

  return img;
};

export default {
  createImage,
  createWebImage,
};
