export const pointInRect = (x, y, boundRect) => {
  const [x1, y1, x2, y2] = boundRect;
  return x >= x1 && x <= x2 && y >= y1 && y <= y2;
};
