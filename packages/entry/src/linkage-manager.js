import { randomId } from "./utils";
export const LINK_PROPERTY = {
  WWWC: "wwwc",
  INVERT: "invert",
  ROTATION: "rotation",
  FLIP_V: "flipV",
  FLIP_H: "flipH",
  SCALE: "scale",
  TRANSLATION: "translation",
  // 通常是某个定位点进行联动，再MPR下
  POSITION: "position",
  // 通常再多序列的时候联动这个属性
  SLICE: "slice",
};

const events = {};

class LinkageManager {
  constructor(viewports) {
    /** @type { Map } */
    this.viewportMap = viewports ?? new Map();
    this.links = new Map();
    /** @type {Boolean} 联动是否启动。 */
    this.isRunning = false;
  }

  /**
   *
   *
   * @param { Array<string> } viewports
   * @param { Array<string> } properties
   * @return { string }
   * @memberof LinkageManager
   */
  link(viewports, properties) {
    const obj = {
      viewports,
      properties,
    };

    const { viewportMap } = this;
    viewports.forEach((id) => {
      const viewport = viewportMap.get(id);
      // reduce出 除了当前id意外的其他viewport
      const relatedViewports = viewports.reduce((relatedViewports, id2) => {
        if (id !== id2) {
          relatedViewports.push(viewportMap.get(id2));
        }
        return relatedViewports;
      }, []);

      // 将关心的属性注入到viewport里
      viewport.imageView.inject(properties);
      properties.forEach((prop) => {
        const key = `${id}-${prop}`;
        const fn = (data) => {
          relatedViewports.forEach((relatedViewport) => {
            relatedViewport?.useCmd(prop, data, false);
          });
        };
        events[key] = fn;
        viewport.imageView.on(key, fn);
      });
    });

    const id = randomId();
    this.links.set(id, obj);

    console.log(`[Linkage] 计划联动[${viewports.join(",")}], 属性[${properties.join(",")}]`);
    return id;
  }

  /**
   *
   *
   * @param { string } linkId
   * @returns { Boolean }
   * @memberof LinkageManager
   */
  unlink(linkId) {
    const { viewports, properties } = this.links.get(linkId);
    viewports.forEach((viewportId) => {
      this._removeHandler(viewportId, properties);
    });

    return this.links.delete(linkId);
  }

  /**
   *
   *
   * @param { string } viewportId
   * @memberof LinkageManager
   */
  removeViewport(viewportId) {
    // 注入的事件监听移除
    this.links.forEach((obj, key, links) => {
      const { viewports, properties } = obj;
      const index = viewports.findIndex((v) => v === viewportId);
      if (index >= 0) {
        const id = viewports.splice(index, 1);
        this._removeHandler(id, properties);
      }

      if (viewports.length === 1) {
        const [id] = viewports;
        this._removeHandler(id, properties);
        links.delete(key);
        return;
      }

      links.set(key, { viewports, properties });
    });
  }

  /**
   * 启动联动
   *
   * @memberof LinkageManager
   */
  launch() {
    this.isRunning = true;
  }

  /**
   * 终止联动
   *
   * @memberof LinkageManager
   */
  terminate() {
    this.isRunning = false;
  }

  _removeHandler(viewportId, properties) {
    const { viewportMap } = this;
    let viewport = viewportMap.get(viewportId);
    if (!viewport) {
      return;
    }

    properties.forEach((prop) => {
      const key = `${id}-${prop}`;
      const fn = events[key];
      viewport.imageView.off(key, fn);
      delete events[key];
    });
  }
}

export default LinkageManager;
