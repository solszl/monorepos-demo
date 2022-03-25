/**
 * 对所给的起止点和终止点进行插值
 *
 * @param { [number, number] } p0 起始点
 * @param { [number, number] } p1 终止点
 * @param { number } count
 * @return { array<number,number> }
 * @memberof MarkLine
 */
export const interpolation = (p0, p1, count) => {
  const [p0x, p0y] = p0;
  const [p1x, p1y] = p1;
  const diffX = p1x - p0x;
  const diffY = p1y - p0y;
  // N个点算上首尾2个点，一共是N+2个点，N+1个空位
  const stepX = diffX / (count + 1);
  const stepY = diffY / (count + 1);
  return Array.from({ length: count + 2 })
    .fill(0)
    .reduce((prev, _, index) => {
      prev.push([p0x + index * stepX, p0y + index * stepY]);
      return prev;
    }, []);
};
