import { TOOLVIEW_INTERNAL_EVENTS } from "@pkg/tools/src";
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

export const LINK_DATA_PROPERTY = {
  ROI: "ellipse_roi",
};

const events = {};

/**
 * 联动管理器
 *
 * @class LinkageManager
 */
class LinkageManager {
  /**
   * Creates an instance of LinkageManager.
   * @param {*} viewports
   * @memberof LinkageManager
   */
  constructor(viewports) {
    /** @type { Map } */
    this.viewportMap = viewports ?? new Map();
    this.links = new Map();
    /** @type {Boolean} 联动是否启动。 */
    this.isRunning = false;
  }

  /**
   * 对viewport集合和对应的属性集合进行联动
   *
   * @param { Array<string> } viewports 视窗集合
   * @param { Array<string> } properties 需要联动的属性集合
   * @param { Array<string> } tools 需要联动的工具属性集合， 如长度工具、ROI等
   * @return { string } 返回一个关联id，以此来证明关联关系
   * @memberof LinkageManager
   */
  link(viewports, properties, tools = []) {
    const obj = {
      viewports,
      properties,
      tools,
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
            relatedViewport?.useCmd(`${prop}_cmd`, data, false);
          });
        };
        events[key] = fn;
        viewport.imageView.on(key, fn);
      });

      // 如果同步了各种测量工具
      if (tools.length) {
        // 工具属性发生变更
        viewport.toolView.on(TOOLVIEW_INTERNAL_EVENTS.DATA_UPDATED, (data) => {
          console.log("updated", data, viewport.data, viewport);
          const { sliceKey, data: viewportData } = viewport;
          // 找出来所有关心的tool类型data
          const filterData = viewportData[sliceKey].filter((data, index) => {
            if (tools.includes(data.type)) {
              return true;
            }
          });

          relatedViewports.forEach((viewport) => {
            const { sliceKey, data: viewportData } = viewport;
            filterData.forEach((d) => {
              let map = viewportData[sliceKey] ?? new Map();
              map.set(d.id, d);
              viewportData[sliceKey] = map;
            });

            viewport.toolView.renderData(viewportData[sliceKey]);
            viewport.toolView.resetData(viewportData[sliceKey]);
          });
        });

        // 工具移除了
        viewport.toolView.on(TOOLVIEW_INTERNAL_EVENTS.DATA_REMOVED, (data) => {
          relatedViewports.forEach((viewport) => {
            const { sliceKey, data: viewportData } = viewport;
            viewportData[sliceKey]?.delete(data.id);

            viewport.toolView.renderData(viewportData[sliceKey]);
          });
        });
      }
    });

    const id = randomId();
    this.links.set(id, obj);

    console.log(
      `[Linkage] 计划联动[${viewports.join(",")}], 属性[${properties.join(",")}], 工具[${tools.join(
        ","
      )}]`
    );
    return id;
  }

  /**
   * 取消联动，对应的联动id， 如果不存在就算了。并且删除对应的联动id
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
