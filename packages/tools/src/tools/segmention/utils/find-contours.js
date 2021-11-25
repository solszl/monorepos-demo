import { contours } from "d3-contour";
export const findContours = (data, config = { width: 512, height: 512, smooth: false, thresholds: 0x20 }) => {
  const { width, height, smooth, thresholds } = config;
  const [result] = contours().size([width, height]).smooth(smooth).thresholds([thresholds])(data);
  return result;
};
