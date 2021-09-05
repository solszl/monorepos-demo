import decodeBigEndian from "../decoders/decodeBigEndian";
import decodeJPEGLS from "../decoders/decodeJPEGLS";
import decodeLittleEndian from "../decoders/decodeLittleEndian";
import decodeRLE from "../decoders/decodeRLE";

export const decode = async (meta, pixelDataSource) => {
  const { transferSyntax } = meta;
  switch (transferSyntax) {
    case "1.2.840.10008.1.2":
    case "1.2.840.10008.1.2.1":
    case "1.2.840.10008.1.2.1.99":
      meta = decodeLittleEndian(meta, pixelDataSource);
      break;
    case "1.2.840.10008.1.2.2":
      meta = decodeBigEndian(meta, pixelDataSource);
      break;
    case "1.2.840.10008.1.2.5":
      meta = decodeRLE(meta, pixelDataSource);
      break;
    case "1.2.840.10008.1.2.4.80":
      // JPEG-LS Lossless Image Compression
      meta = await decodeJPEGLS(meta, pixelDataSource);
      break;
    default:
      break;
  }

  return meta;
};
