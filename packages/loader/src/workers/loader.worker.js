import { createImage, createWebImage } from "@pkg/dicom/src";
import registerPromiseWorker from "promise-worker/register";

const loadImage = async (imageId) => {
  const ab = await (await fetch(imageId)).arrayBuffer();
  // console.time("parse image");
  const image = await createImage(ab);
  // console.timeEnd("parse image");
  return image;
};

const loadWebImage = async (imageId) => {
  const ab = await (await fetch(imageId)).arrayBuffer();
  const image = await createWebImage(ab);
  return image;
};

const LoaderWorker = registerPromiseWorker(async (e) => {
  const { imageUrl, seriesId, index, plane, format } = e;
  let image;
  if (format === "dicom") {
    image = await loadImage(imageUrl);
  } else if (format === "webimage") {
    image = await loadWebImage(imageUrl);
  } else {
  }
  return { seriesId, index, plane, image };
});

export { LoaderWorker };
