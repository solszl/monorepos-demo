import { Component } from "@pkg/core/src";

class AbstractViewport extends Component {
  constructor(option = {}) {
    super(option);
    this.option = option;
    this.el = option.el;

    this.renderer = null;
  }

  init() {}

  async render() {}

  resize(width, height) {}

  validateNow() {
    this._displayChanged = true;
    this.render();
  }

  async snapshot() {}

  getRootSize() {
    let { clientWidth, clientHeight } = this.el;
    return { width: clientWidth, height: clientHeight };
  }

  destroy() {
    super.destroy();
    this?.renderer?.destroy();
    this.renderer = null;

    this.el.innerText = "";
  }

  inject(eventNames) {
    // ["slice", "wwwc"] 这样的
    // 优化，如：["slice", "wwwc"] 又来了一份 ["slice", "wwwc", "flipV"] 此时会合并数据
    this.injectEventNames = (this.injectEventNames ?? []).concat(...eventNames);
    this.injectEventNames = [...new Set(this.injectEventNames)];
  }

  tryDispatchInjectEvents(evt, data, dispatch = true) {
    if (!dispatch) {
      return;
    }

    const { injectEventNames = [] } = this;
    if (injectEventNames.includes(evt)) {
      this.emit(`${this.id}-${evt}`, data);
    }
  }

  static create() {
    console.error("need implemented by subclass.");
  }
}

export default AbstractViewport;
