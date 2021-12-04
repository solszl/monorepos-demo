export const rectIntersect = (rect0, rect1) => {
  const [x0, y0, x1, y1] = rect0;
  const [x2, y2, x3, y3] = rect1;
  const w0 = Math.abs(x1 - x0);
  const h0 = Math.abs(y1 - y0);
  const w1 = Math.abs(x3 - x2);
  const h1 = Math.abs(y3 - y2);

  // 不相交
  const intersect = x0 + w0 < x2 || x2 + w1 < x0 || y0 + h0 < y2 || y2 + h1 < y0;
  return !intersect;
};
