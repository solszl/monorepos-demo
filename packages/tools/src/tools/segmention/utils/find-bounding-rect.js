/**
 *
 *
 * @param { Array } arr
 */
export const findBoundingRect = (allContour) => {
  let minX = Number.MAX_SAFE_INTEGER;
  let minY = Number.MAX_SAFE_INTEGER;
  let maxX = Number.MIN_SAFE_INTEGER;
  let maxY = Number.MIN_SAFE_INTEGER;
  allContour.map((contour) => {
    contour.map((a) => {
      minX = Math.min(minX, a[0]);
      minY = Math.min(minY, a[1]);
      maxX = Math.max(maxX, a[0]);
      maxY = Math.max(maxY, a[1]);
    });
  });

  return [minX, minY, maxX, maxY];
};
