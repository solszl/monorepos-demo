export const SELECTOR_ENUM = {
  ANCHOR: ".node-anchor",
  ITEM: ".node-item",
  DASHLINE: ".node-dashline",
  LABEL: ".node-label",
};

import { Node } from "konva/lib/Node";
import { TOOL_COLORS } from "../../constants";
import UIComponent from "../../shape/parts/ui-component";
export const activeUtil = {
  on: (shape) => {
    let selector = ".node-anchor";
    shape.find(selector).forEach((item) => {
      /** @type {Node} */
      item.stroke(TOOL_COLORS.HOVER?.[selector] ?? TOOL_COLORS.HOVER["default-color"]);
      item.show();
      const numChildren = item.getParent().getChildren().length - 1;
      item.zIndex(numChildren);
    });

    selector = ".node-item";
    shape.find(selector).forEach((item) => {
      item.stroke(TOOL_COLORS.HOVER?.[selector] ?? TOOL_COLORS.HOVER["default-color"]);
    });

    selector = ".node-dashline";
    shape.find(selector).forEach((item) => {
      item.stroke(TOOL_COLORS.HOVER?.[selector] ?? TOOL_COLORS.HOVER["default-color"]);
    });

    selector = ".node-label";
    shape.find(selector).forEach((item) => {
      item.fill(TOOL_COLORS.HOVER?.[selector] ?? TOOL_COLORS.HOVER["default-color"]);
    });
  },
  off: (shape) => {
    let selector = ".node-anchor";
    shape.find(selector).forEach((item) => {
      /** @type {Node} */
      item.stroke(TOOL_COLORS.NORMAL?.[selector] ?? TOOL_COLORS.NORMAL["default-color"]);
      item.hide();
    });

    selector = ".node-item";
    shape.find(selector).forEach((item) => {
      item.stroke(TOOL_COLORS.NORMAL?.[selector] ?? TOOL_COLORS.NORMAL["default-color"]);
    });

    selector = ".node-dashline";
    shape.find(selector).forEach((item) => {
      item.stroke(TOOL_COLORS.NORMAL?.[selector] ?? TOOL_COLORS.NORMAL["default-color"]);
    });

    selector = ".node-label";
    shape.find(selector).forEach((item) => {
      item.fill(TOOL_COLORS.NORMAL?.[selector] ?? TOOL_COLORS.NORMAL["default-color"]);
    });
  },
};

/**
 * @param { UIComponent } ctx
 * @param { string } cursor
 */
export const cursor = (ctx, cursor = "auto") => {
  const stage = ctx.getStage();
  if (stage) {
    stage.container().style.cursor = cursor || "auto";
  }
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

export const toCT = (pixelData, slope, intercept) => {
  return pixelData.map((value) => value * slope + intercept);
};

export const connectTextNode = (node, from, dashLine) => {
  const text = node;
  // 求出textNode的 左中、上中、右中、下中 的4个位置
  const a = [text.x(), text.y() + text.height() / 2];
  const b = [text.x() + text.width() / 2, text.y()];
  const c = [text.x() + text.width(), text.y() + text.height() / 2];
  const d = [text.x() + text.width() / 2, text.y() + text.height()];

  const to = [a, b, c, d];

  let min = Number.MAX_SAFE_INTEGER;
  let formPoint = null;
  let toPoint = null;

  const getDistance = (a, b) => {
    return ((b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2) ** 0.5;
  };
  // 锚点也text的四边进行距离比对，求出最短路径对应的点
  for (let i = 0; i < from.length; i += 1) {
    for (let j = 0; j < to.length; j += 1) {
      const distance = getDistance(from[i], to[j]);
      if (distance < min) {
        formPoint = from[i];
        toPoint = to[j];
        min = distance;
      }
    }
  }

  // 定义虚线的点
  dashLine.points([formPoint[0], formPoint[1], toPoint[0], toPoint[1]]);
  dashLine.show();
};

export const randomId = () => {
  return Math.random().toString(36).substring(2);
};
