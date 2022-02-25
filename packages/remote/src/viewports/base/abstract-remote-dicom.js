import { ImageViewport } from "@pkg/viewer/src";
import SimpleLoader from "../../bizz/load/simpleLoader";

/**
 * 服务端渲染-影像文件渲染基类
 *
 * @class RemoteDicomViewport
 * @extends { ImageViewport }
 */
class AbstractRemoteDicomViewport extends ImageViewport {
  constructor(option = {}) {
    super(option);
    this.loader = new SimpleLoader();

    // 根据transferMode 和 route找到对应的连接
    const { route, resource, transferMode = "socket" } = option;
    const transfer = resource.getTransfer(transferMode);
    const conn = transfer.getConnection(route);
    this.connection = conn;
  }

  async initialAsyncWorkflow() {}

  async mixinMethods(route) {}

  getImage(index) {
    // 子类实现是旋转角度还是跳转指定层。
  }

  _splitMessageType(messageType) {
    return messageType.split("|>");
  }

  async setUrl(url) {
    const image = await this.loader.load(url);
    if (!image) {
      return;
    }

    this.displayState.owwwc = {
      ww: image.windowWidth,
      wc: image.windowCenter,
    };
    this.showImage(image);
    // console.log("影像加载完成", image);
    return image;
  }

  async propertyChanged() {}

  destroy() {
    super.destroy();
    this.loader.destroy();
  }
}

export default AbstractRemoteDicomViewport;
