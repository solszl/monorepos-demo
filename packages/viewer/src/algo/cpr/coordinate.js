import { mat4, vec3 } from "gl-matrix";

class Coordinate {
  constructor(images) {
    if (images && images.length < 2) {
      console.error("images length is less than 2.");
      return;
    }

    this.img0 = images[0];
    this.img1 = images[1];
  }

  ijk2lps(ratio = 2) {
    this.ratio = ratio;
    const { img0, img1 } = this;
    if (!img0 || !img1) {
      console.error(`img error, img0:${img0}, img1:${img1}.`);
      return;
    }

    const {
      imagePositionPatient: origin0,
      imageOrientationPatient: orientation,
      columnPixelSpacing: spX,
      rowPixelSpacing: spY,
    } = img0;

    const { imagePositionPatient: origin1 } = img1;

    const dI = vec3.scale([], orientation, spY / ratio);
    const dJ = vec3.scale([], orientation.slice(3), spX / ratio);
    const dK = vec3.sub([], origin1, origin0);
    const scaleK = [dK[0], dK[1], dK[2] / ratio];

    return [...dI, 0, ...dJ, 0, ...scaleK, 0, ...origin0, 1];
  }

  lps2ijk() {
    return mat4.invert([], this.ijk2lps(this.ratio));
  }
}

export default Coordinate;
