import { DD } from "konva/lib/DragAndDrop";
import UIComponent from "../../shape/parts/ui-component";
import { useImageState } from "../../state/image-state";
import { useViewportState } from "../../state/viewport-state";
import { activeUtil } from "../utils";
class BaseTool extends UIComponent {
  constructor(config = {}) {
    super(config);
    this._data = null;
    this.UIInitialed = false;
    // 是否是内部组件
    this.$txComponent = true;
  }

  initialUI() {}
  verifyDataLegal() {}
  convertLocalCoords(data) {}
  renderData() {}

  mouseEnter(e) {}
  mouseLeave(e) {}
  mouseOver(e) {}
  mouseOut(e) {}
  mouseMove(e) {}
  mouseDown(e) {}
  mouseUp(e) {
    // konva 的bug,内部dragAndDrop(DD) 导出为一个对象。在多实例的情况下可能引发结束拖拽不派发dragEnd事件，再这里强制触发一次
    if (DD.justDragged || DD.isDragging) {
      DD._endDragBefore(e);
      DD._endDragAfter(e);
    }
  }
  mouseClick(e) {}
  mouseRightClick(e) {}
  mouseDoubleClick(e) {}
  mouseWheel(e) {}
  mouseWheelClick(e) {}
  documentMouseMove(e) {}
  documentMouseUp(e) {}

  set data(val) {
    this._data = val;
    this.careStageEvent = false;
    if (!this.UIInitialed) {
      this.initialUI();
      // 如果使用了自定义配色。就不取消激活了
      const { useCustomColourConfig = false } = val;
      if (useCustomColourConfig === false) {
        activeUtil.off(this);
      }
    }
    this.renderData();
  }

  get data() {
    return this._data;
  }

  setData(val) {
    this._data = val;
  }

  verify(x, y, width, height) {
    const { $transform: transform } = this;
    const [ox, oy] = transform.invertPoint(x, y);
    return ox >= 0 && ox <= width && oy >= 0 && oy <= height;
  }

  get imageState() {
    if (!this._imageState) {
      const stageId = this.$stage.id();
      const [getImageState] = useImageState(stageId);
      this._imageState = getImageState();
    }

    return this._imageState;
  }

  get viewportState() {
    if (!this._viewportState) {
      const stageId = this.$stage.id();
      const [getViewportState] = useViewportState(stageId);
      this._viewportState = getViewportState();
    }

    return this._viewportState;
  }
}

export default BaseTool;
