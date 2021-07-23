import { DataSet } from "dicom-parser";
export /**
 *
 *
 * @param { DataSet } dataset
 * @param { object } meta
 */
const getPixelData = (dataset, meta) => {
  const pixelDataElement = meta.elements.x7fe00010;
  if (!pixelDataElement) {
    return null;
  }

  if (pixelDataElement.encapsulatedPixelData) {
    return getEncapsulatedImageFrame(dataset, meta);
  }

  return getUncompressedImageFrame(meta);
};

const getEncapsulatedImageFrame = (dataset, meta) => {
  console.log(1);
  return 1;
};

/**
 * Function to deal with unpacking a binary frame
 */
const unpackBinaryFrame = (byteArray, frameOffset, pixelsPerFrame) => {
  // Create a new pixel array given the image size
  const pixelData = new Uint8Array(pixelsPerFrame);

  for (let i = 0; i < pixelsPerFrame; i++) {
    // Compute byte position
    const bytePos = Math.floor(i / 8);

    // Get the current byte
    const byte = byteArray[bytePos + frameOffset];

    // Bit position (0-7) within byte
    const bitPos = i % 8;

    // Check whether bit at bitpos is set
    pixelData[i] = isBitSet(byte, bitPos) ? 1 : 0;
  }

  return pixelData;
};

const getUncompressedImageFrame = (meta) => {
  const {
    elements: { x7fe00010: pixelDataElement },
    rows,
    columns,
    samplesPerPixel,
    bitsAllocated,
    byteArray,
  } = meta;

  // 数据偏移
  const pixelDataOffset = pixelDataElement.dataOffset;
  const pixelsPerFrame = rows * columns * samplesPerPixel;
  if (bitsAllocated === 8) {
    return new Uint8Array(byteArray.buffer, pixelDataOffset, pixelsPerFrame);
  } else if (bitsAllocated === 16) {
    return new Uint8Array(byteArray.buffer, pixelDataOffset, pixelsPerFrame * 2);
  } else if (bitsAllocated === 1) {
    return unpackBinaryFrame(byteArray, pixelDataOffset, pixelsPerFrame);
  } else if (bitsAllocated === 32) {
    return new Uint8Array(byteArray.buffer, pixelDataOffset, pixelsPerFrame * 4);
  }
};
