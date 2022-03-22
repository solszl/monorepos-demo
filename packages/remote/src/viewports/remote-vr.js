import AbstractRemoteStreamViewport from "./base/abstract-remote-stream";

class RemoteVRViewport extends AbstractRemoteStreamViewport {
  constructor(options = {}) {
    super(options);
    // paraview 的bug，导致右键可能不派发数据。 强行触发一次鼠标抬起
    const { el } = options;
    const dropHandler = (e) => {
      // let { offsetX, offsetY, currentTarget } = e;
      // const { clientWidth, clientHeight } = currentTarget;
      // let mouse = { x: offsetX / clientWidth, y: 1 - offsetY / clientHeight };
      // // 可能存在宽高为0的情况？
      // if (clientWidth === 0 || clientHeight === 0) {
      //   mouse = { x: 0.5, y: 0.5 };
      // }
      // this?.stopMouseInteraction(mouse);
      if (this?.remoteRenderer?.mouseHandler) {
        this.remoteRenderer.mouseHandler.inRightClickHandling = false;
      }
    };

    el.addEventListener("mouseout", (e) => {
      if (e.buttons === 2) {
        dropHandler(e);
      }
    });

    el.addEventListener("mouseup", (e) => {
      if (e.button === 2) {
        dropHandler(e);
      }
    });
  }

  async initialAsyncWorkflow() {
    const { route } = this.option;
    await this.mixinMethods(route);
  }

  async mixinMethods(route) {
    super.mixinMethods(route);

    // 动态引入函数列表 进行mixin操作
    const { METHODS } = await import(`./../msg/method-${route}`);
    Object.entries(METHODS).forEach(([key, value]) => {
      Reflect.set(this, key, value.bind(this));
    });
  }

  static create(option) {
    return new RemoteVRViewport(option);
  }
}

export default RemoteVRViewport;
