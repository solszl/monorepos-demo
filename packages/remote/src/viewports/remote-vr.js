import AbstractRemoteStreamViewport from "./base/abstract-remote-stream";

class RemoteVRViewport extends AbstractRemoteStreamViewport {
  constructor(options = {}) {
    super(options);
    // paraview 的bug，导致右键可能不派发数据。 所以每次enter进来的时候，强行触发一次鼠标抬起
    const { el } = options;
    el.addEventListener("mouseenter", (e) => {
      this?.stopMouseInteraction();
    });

    el.addEventListener("mouseup", (e) => {
      console.log(this.remoteRenderer, e);
      let { offsetX, offsetY, clientWidth, clientHeight } = e;
      let mouse = { x: offsetX / clientWidth, y: 1 - offsetY / clientHeight };
      // 可能存在宽高为0的情况？
      if (clientWidth === 0 || clientHeight === 0) {
        mouse = { x: 0.5, y: 0.5 };
      }
      this?.stopMouseInteraction(mouse);
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
