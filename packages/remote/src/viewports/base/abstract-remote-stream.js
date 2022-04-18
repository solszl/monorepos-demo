import { AbstractViewport } from "@pkg/viewer/src";
import ParaViewWebClient from "paraviewweb/src/IO/WebSocket/ParaViewWebClient";
import RemoteRenderer from "paraviewweb/src/NativeUI/Canvas/RemoteRenderer";

/**
 * 服务端渲染-流式文件渲染基类
 *
 * @class RemoteStreamViewport
 * @extends {AbstractRemoteViewport}
 */
class AbstractRemoteStreamViewport extends AbstractViewport {
  constructor(option = {}) {
    super(option);

    // 根据transferMode 和 route找到对应的连接
    const { route, resource, transferMode = "socket" } = option;
    const transfer = resource.getTransfer(transferMode);
    const conn = transfer.getConnection(route);
    this.connection = conn;

    const protocols = ["MouseHandler", "ViewPort", "ViewPortImageDelivery"];
    const client = ParaViewWebClient.createClient(conn, protocols);
    const renderer = new RemoteRenderer(client);
    // 根据渲染完成输出一些必要参数
    renderer.once("image-loaded", (e) => {
      // prettier-ignore
      const { tracer:{ enable }, id, option:{ plane } } = this;
      if (enable) {
        const key = `${id} - ${plane} - render`;
        const extendMsg = "体渲染";
        const now = performance.now();
        console.log(`[${key}]: ${extendMsg} now: ${now}`);
      }

      // TODO: 服务端渲染解决后，将代码移除
      // 可能存在黑屏的情况。当第一次接收后，无论是黑屏还是正常，均多刷新一次
      setTimeout(() => {
        renderer.render(true);
      }, 1000);
    });
    renderer.setContainer(option.el);
    this.remoteRenderer = renderer;

    this.init();
  }

  async initialAsyncWorkflow() {}

  async mixinMethods(route) {}

  _splitMessageType(messageType) {
    return messageType.split("|>");
  }

  validateNow() {
    this.remoteRenderer.render();
  }

  resize(width, height) {
    super.resize(width, height);
    this.remoteRenderer.resize();
  }

  validateNow() {
    if (!this.renderer) {
      return;
    }

    if (!this.remoteRenderer) {
      return;
    }

    this.remoteRenderer.render(true);
    super.validateNow();
  }
  destroy() {
    super.destroy();
    // paraview client 可能存在一种情况，canvas 没有父容器，但是他的destroy 仍然会移除这个元素,而无法找到父容器的时候就会报错。
    const { canvas } = this.remoteRenderer;
    if (canvas && !canvas.parentNode) {
      this.remoteRenderer.container.appendChild(canvas);
    }
    this.remoteRenderer.destroy();
    this.remoteRenderer = null;
  }
}

export default AbstractRemoteStreamViewport;
