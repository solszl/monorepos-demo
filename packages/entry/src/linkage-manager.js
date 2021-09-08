import { randomId } from "./utils";
export const LINK_PROPERTY = {
  WWWC: "wwwc",
  ROTATION: "rotation",
  FLIP_V: "flip_v",
  FLIP_H: "flip_h",
  INVERT: "invert",
  SCALE: "scale",
  TRANSLATION: "translation",
  // 通常是某个定位点进行联动，再MPR下
  POSITION: "position",
  // 通常再多序列的时候联动这个属性
  SLICE: "slice",
};

class LinkageManager {
  constructor(viewports) {
    this.viewportMap = viewports ?? new Map();
    this.links = new Map();
    window.l = this;
  }

  link(viewports, properties) {
    const obj = {
      viewports,
      properties,
    };

    const { viewportMap } = this;
    viewports.forEach((viewport) => {
      // TODO: 注入属性变化监听并且再响应属性变化的时候，将该变化同步给其他viewport
    });

    const id = randomId();
    this.links.set(id, obj);
    return id;
  }

  unlink(linkId) {
    // TODO: 注入的事件监听要移除啊
    this.links.delete(linkId);
  }

  removeViewport(viewportId) {
    // TODO: 注入的事件监听要移除啊
    this.links.forEach((obj, key, links) => {
      const { viewports, properties } = obj;
      const index = viewports.findIndex((v) => v === viewportId);
      if (index >= 0) {
        viewports.splice(index, 1);
      }

      if (viewports.length === 1) {
        links.delete(key);
        return;
      }

      links.set(key, { viewports, properties });
    });
  }
}

export default LinkageManager;
