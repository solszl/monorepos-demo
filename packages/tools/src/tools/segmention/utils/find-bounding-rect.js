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

  let flatted = allContour.flat(Infinity);
  for (let i = 0; i < flatted.length; i += 2) {
    minX = Math.min(minX, flatted[i]);
    minY = Math.min(minY, flatted[i + 1]);
    maxX = Math.max(maxX, flatted[i]);
    maxY = Math.max(maxY, flatted[i + 1]);
  }

  return [minX, minY, maxX, maxY].map((i) => Math.round(i));
};
