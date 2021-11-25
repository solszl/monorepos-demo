import { arrayToObject } from "./array-to-object";
import { objectToArray } from "./object-to-array";
import { simplifyContours } from "./simplify-contours";
export const slim = (contours) => {
  const result = contours.map((contour) => {
    let temp = contour.map((c) => {
      let result = [];
      c.reduce((prev, val) => {
        prev.push(arrayToObject(val));
        return prev;
      }, result);

      return result;
    });

    let temp2 = temp.map((c) => {
      return simplifyContours(c);
    });

    let temp3 = temp2.map((contour) => {
      return contour.map((c) => {
        return objectToArray(c);
      });
    });
    return temp3;
  });

  return result;
};
