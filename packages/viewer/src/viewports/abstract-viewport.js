import { Component } from "@saga/core";
class AbstractViewport extends Component {
  constructor(option = {}) {
    super();

    this.iframe = null;
    this.el = this.config.el;
  }

  init() {}

  initResize() {
    this.iframe = document.createElement("iframe");
    this.iframe.style.cssText = `position: absolute;top: 0;left: 0;width: 100%;height: 100%;border: 0;`;
    this.el.style.position = "relative";
    this.el.style.overflow = "hidden";
    this.el.insertBefore(this.iframe, this.el.firstChild);
    this.iframe.contentWindow.onresize = (e) => {
      // resize
    };
  }

  initRenderer() {}
}

export default AbstractViewport;
