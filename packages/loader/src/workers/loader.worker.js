import createImage from "@saga/dicom";
import registerPromiseWorker from "promise-worker/register";

const loadImage = async (imageId) => {
  const ab = await (await fetch(imageId)).arrayBuffer();
  const image = await createImage(ab);
  return image;
};

// self.addEventListener(
//   "message",
//   async (e) => {
//     const { imageUrl, seriesId, index, plane } = e.data;
//     console.log("worker load", imageUrl);
//     const img = await loadImage(imageUrl);
//     self.postMessage({ seriesId, index, plane, img });
//   },
//   false
// );

registerPromiseWorker(async (e) => {
  const { imageUrl, seriesId, index, plane } = e;
  const img = await loadImage(imageUrl);
  return { seriesId, index, plane, img };
});
