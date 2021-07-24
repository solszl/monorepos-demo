import { Component } from "@saga/core";
class AbstractViewport extends Component {
  constructor(option = {}) {
    super();

    this.core = option.core;
    this.renderSchedule = this.core.renderSchedule; // from core instance.
    this.el = option.el;
    this.iframe = null;

    this.width = -1;
    this.height = -1;
    this.init();
  }

  init() {
    this.initResize();
  }

  initResize() {
    this.iframe = document.createElement("iframe");
    this.iframe.style.cssText = `position: absolute;top: 0;left: 0;width: 100%;height: 100%;border: 0;`;
    this.el.style.position = "relative";
    this.el.style.overflow = "hidden";
    this.el.insertBefore(this.iframe, this.el.firstChild);
    this.iframe.contentWindow.onresize = (e) => {
      const { width, height } = this._getRootSize();
      this.width = width;
      this.height = height;
    };
  }

  _getRootSize() {
    let { clientWidth, clientHeight } = this.el;
    return { width: clientWidth, height: clientHeight };
  }

  static create() {
    console.error("need implemented by subclass.");
  }
}

export default AbstractViewport;
