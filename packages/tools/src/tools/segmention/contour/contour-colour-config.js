import { hex2Rgba } from "../utils/hex-to-rgba";
class ContourColourConfig {
  constructor(config) {
    this.config = config;
  }

  get(key) {
    const { colour = {} } = this.config[key.toLocaleUpperCase()];
    let copied = { ...colour };
    // 描边
    if (colour.lineColor) {
      const { lineColor, lineAlpha = 1 } = colour;
      const c1 = hex2Rgba(lineColor, lineAlpha);
      delete copied["lineColor"];
      delete copied["lineAlpha"];
      copied["lineColor"] = c1;
    }

    // 填色
    if (colour.fillColor) {
      const { fillColor, fillAlpha = 1 } = colour;
      const c2 = hex2Rgba(fillColor, fillAlpha);
      delete copied["fillColor"];
      delete copied["fillAlpha"];

      copied["fillColor"] = c2;
    }

    return copied;
  }
}
export default ContourColourConfig;
