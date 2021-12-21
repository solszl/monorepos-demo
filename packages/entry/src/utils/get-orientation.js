export const getOrientation = (images, { rotate = 0, hFlip = false, vFlip = false }) => {
  if (images.length < 2) {
    throw new Error("no enough image files.");
  }

  const [img0, img1] = images;
};
