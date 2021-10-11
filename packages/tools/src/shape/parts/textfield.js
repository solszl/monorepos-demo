import { Text } from "konva/lib/shapes/Text";
import { TOOL_COLORS, TOOL_ITEM_SELECTOR } from "../../constants";

const SHADOW = {
  shadowColor: "#000000",
  shadowBlur: 1,
  shadowOffsetX: 1,
  shadowOffsetY: 1,
  shadowOpacity: 0.8,
  cornerRadius: 10,
};

class TextField extends Text {
  constructor(config = {}) {
    super(Object.assign({}, SHADOW, config));
    this.fontSize(15);
    this.align("center");
    this.name(TOOL_ITEM_SELECTOR.LABEL);
    this.fill(TOOL_COLORS.NORMAL[`.${TOOL_ITEM_SELECTOR.LABEL}`]);
    this.draggable(true);
  }
}

export default TextField;
