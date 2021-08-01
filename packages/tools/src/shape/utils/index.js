export const SELECTOR_ENUM = {
  ANCHOR: ".node-anchor",
  ITEM: ".node-item",
  DASHLINE: ".node-dashline",
  LABEL: ".node-label",
};

export const COLORS = {
  hover: {
    "default-color": "",
    ".node-anchor": "",
  },
  normal: {
    "default-color": "",
    ".node-anchor": "",
  },
};
import { Node } from "konva/lib/Node";
import UIComponent from "../parts/ui-component";
export const activeUtil = {
  on: (shape) => {
    let selector = ".node-anchor";
    shape.find(selector).forEach((item) => {
      /** @type {Node} */
      item.stroke(COLORS.hover?.[selector] ?? COLORS.hover["default-color"]);
      item.show();
      const numChildren = item.getParent().getChildren().length - 1;
      item.zIndex(numChildren);
    });

    selector = ".node-item";
    shape.find(selector).forEach((item) => {
      item.stroke(COLORS.hover?.[selector] ?? COLORS.hover["default-color"]);
    });

    selector = ".node-dashline";
    shape.find(selector).forEach((item) => {
      item.stroke(COLORS.hover?.[selector] ?? COLORS.hover["default-color"]);
    });

    selector = ".node-label";
    shape.find(selector).forEach((item) => {
      item.fill(COLORS.hover?.[selector] ?? COLORS.hover["default-color"]);
    });
  },
  off: (shape) => {
    let selector = ".node-anchor";
    shape.find(selector).forEach((item) => {
      /** @type {Node} */
      item.stroke(COLORS.normal?.[selector] ?? COLORS.normal["default-color"]);
      item.hide();
    });

    selector = ".node-item";
    shape.find(selector).forEach((item) => {
      item.stroke(COLORS.normal?.[selector] ?? COLORS.normal["default-color"]);
    });

    selector = ".node-dashline";
    shape.find(selector).forEach((item) => {
      item.stroke(COLORS.normal?.[selector] ?? COLORS.normal["default-color"]);
    });

    selector = ".node-label";
    shape.find(selector).forEach((item) => {
      item.fill(COLORS.normal?.[selector] ?? COLORS.normal["default-color"]);
    });
  },
};

/**
 * @param { UIComponent } ctx
 * @param { string } cursor
 */
export const cursor = (ctx, cursor = "auto") => {
  ctx.getStage().container().style.cursor = cursor || "auto";
};

/**
 * 计算图像内的绝对位置
 * 参考： https://konvajs.org/docs/sandbox/Relative_Pointer_Position.html
 *
 * @export
 * @param { Node } node
 * @returns
 */
export function getRelativePointerPosition(node, round = false) {
  // the function will return pointer position relative to the passed node
  var transform = node.getAbsoluteTransform().copy();
  // to detect relative position we need to invert transform
  transform.invert();

  // get pointer (say mouse or touch) position
  var pos = node.getStage().getPointerPosition();

  // now we find relative point
  if (round === false) {
    transform.point(pos);
  }

  const { x, y } = transform.point(pos);
  return { x: ~~x, y: ~~y };
}
