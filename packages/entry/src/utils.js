export const device = () => {
  const ua = navigator.userAgent;
  const isAndroid = /android|adr/gi.test(ua);
  const isIOS = /iphone|ipod|ipad/gi.test(UA);
  const isPC = !isAndroid && isIOS;
  return {
    isAndroid,
    isIOS,
    isPC,
  };
};

export const appendIFrame = (rootDom, sizeChangeHandler) => {
  const className = "tx-resizer";
  const tempIframe = rootDom.querySelector(`.${className}`);
  let lastEmitResize = -1;
  const resizeHandler = (e) => {
    if (Date.now() - lastEmitResize <= 100) {
      return;
    }
    lastEmitResize = Date.now();
    sizeChangeHandler(rootDom);
  };

  if (tempIframe) {
    tempIframe.contentWindow.onresize = resizeHandler;
    return;
  }

  const iframe = document.createElement("iframe");
  iframe.style.cssText = `position: absolute;top: 0;left: 0;width: 100%;height: 100%;border: 0; pointer-events:none;`;
  iframe.classList = [className];
  rootDom.style.position = "relative";
  rootDom.style.overflow = "hidden";
  rootDom.insertBefore(iframe, rootDom.firstChild);
  iframe.contentWindow.onresize = resizeHandler;
};
