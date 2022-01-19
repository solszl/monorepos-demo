import { Component } from "@pkg/core/src";
import { DD } from "konva/lib/DragAndDrop";
import { Layer } from "konva/lib/Layer";
import { Stage } from "konva/lib/Stage";
import { INTERNAL_EVENTS } from "./constants";
import { TOOL_CONSTRUCTOR } from "./constructor";
import { useGlobalConfig } from "./state/global-config";
import { removeImageState, useImageState } from "./state/image-state";
import ToolState from "./state/tool-state";
import { removeViewportState, useViewportState } from "./state/viewport-state";
import { transform as transformCoords } from "./tools/utils/coords-transform";
import Transform from "./transform";
import MouseTrap from "./trap/mouse-trap";

class View extends Component {
  constructor(option = {}) {
    super(option);

    this.initContainer(option.el);
    this.transform = new Transform();
    this.toolState = new ToolState();
    this.toolState.$transform = this.transform;

    const [, setGlobalConfig] = useGlobalConfig(this.stage.id());
    setGlobalConfig(option?.config?.tools ?? {});
  }

  autofit() {
    // 适配容器大小，因为初始化的时候，业务通常使用了flex布局获取元素名称后浏览器并未进行元素宽高等计算，此时宽高传入为0.导致toolView的初始尺寸为(0,0)。
    // 兼容此问题解决方案为，sliceChanged的时候，使用autofit进行宽高适配
    const container = this.stage.getAttr("container");
    this.stage.setSize(this._getRootSize(container));
  }

  resize(width, height) {
    this.stage.setSize({ width, height });
  }

  useTool(toolType, button = 1) {
    this.toolState.updateState(toolType, button, this.stage);
    MouseTrap.enable(this.stage, this.toolState);
  }

  initContainer(el) {
    const container = document.createElement("div");
    container.classList.add("tools-container");
    container.style.cssText = `position: absolute;top: 0;left: 0;width: 100%;height: 100%;border: 0; z-index:2;`;
    el.appendChild(container);

    const stage = new Stage(
      Object.assign(
        {},
        {
          container,
          id: this.id,
        },
        this._getRootSize(el)
      )
    );
    this.stage = stage;

    stage.add(
      new Layer({
        id: "toolsLayer",
      })
    );

    // 整理事件监听
    Object.values(INTERNAL_EVENTS).forEach((eventName) => {
      stage.on(eventName, (info) => {
        this.emit(eventName, info);
      });
    });
  }

  updateViewport(config = {}) {
    const [getState, setViewportState] = useViewportState(this.stage.id());
    setViewportState(Object.assign({}, getState(), config, { stageId: this.stage.id() }));
    this._applyTransform();
  }

  updateImageState(config = {}) {
    const [, setImageState] = useImageState(this.stage.id());
    setImageState(config);
  }

  destroy() {
    removeImageState(this.stage.id());
    removeViewportState(this.stage.id());
    this.stage.destroy();
  }

  /**
   * 设置工具层数据
   *
   * @param { array } data
   * @memberof View
   */
  renderData(data = new Map()) {
    const layer = this.stage.findOne("#toolsLayer");
    if (!layer) {
      console.error(`can't find tools layer.`);
    }

    // 如果有正在拖拽的， 就先取消拖拽，再清空当前layer
    DD?._dragElements.clear();
    layer.removeChildren();
    data.forEach((obj) => {
      const { type, id } = obj;
      const item = new TOOL_CONSTRUCTOR[type]();
      item.$stage = layer.getStage();
      item.$transform = this.transform;
      item.data = transformCoords(obj, this.transform);
      item.name(id);
    });
    layer.batchDraw();
  }

  resetData(data = new Map()) {
    const layer = this.stage.findOne("#toolsLayer");
    if (!layer) {
      console.error(`can't find tools layer.`);
    }
    data.forEach((obj) => {
      const item = layer.findOne(`.${obj.id}`);
      const data = transformCoords(obj, this.transform);
      item?.setData(data);
      item?.renderData();
    });
    layer.batchDraw();
  }

  getCanvas() {
    return this.stage.toCanvas();
  }

  _getRootSize(el) {
    let { clientWidth, clientHeight } = el;
    return { width: clientWidth, height: clientHeight };
  }

  _applyTransform() {
    const stageId = this.stage.id();
    const [viewportState] = useViewportState(stageId);
    const { scale, rotate, flip, width, height, x, y, rootWidth, rootHeight } = viewportState();
    const { transform } = this;

    transform.reset();

    if (x || y) {
      transform.translate(x, y);
    }

    transform.translate(rootWidth / 2, rootHeight / 2);

    if (flip) {
      const { h = false, v = false } = flip;
      const fv = v ? -1 : 1;
      const fh = h ? -1 : 1;
      transform.scale(fh, fv);
    }

    if (!!scale) {
      transform.scale(scale, scale);
    }

    if (!!rotate) {
      transform.rotate(rotate);
    }

    transform.translate(-width / 2, -height / 2);

    return transform.m;
  }
}

export default View;
