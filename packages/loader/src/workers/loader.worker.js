import createImage from "@saga/dicom";

const loadImage = async (imageId, signal) => {
  const ab = await (await fetch(imageId, { signal })).arrayBuffer();
  const image = await createImage(ab);
  return image;
};

const retryLoadImage = (imageId, signal, )
