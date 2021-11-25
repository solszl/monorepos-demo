import simplify from "simplify-js";

export const simplifyContours = (contour) => {
  let data = simplify(contour, 1, true);
  return data;
};
