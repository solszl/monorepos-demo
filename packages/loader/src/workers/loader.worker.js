import { createImage } from "@saga/dicom";
import registerPromiseWorker from "promise-worker/register";

const loadImage = async (imageId) => {
  const ab = await (await fetch(imageId)).arrayBuffer();
  // console.time("parse image");
  const image = await createImage(ab);
  // console.timeEnd("parse image");
  return image;
};

registerPromiseWorker(async (e) => {
  const { imageUrl, seriesId, index, plane } = e;
  const image = await loadImage(imageUrl);
  return { seriesId, index, plane, image };
});
