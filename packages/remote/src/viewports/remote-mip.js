import AbstractRemoteDicomViewport from "./base/abstract-remote-dicom";

class RemoteMIPViewport extends AbstractRemoteDicomViewport {
  constructor(options = {}) {
    super(options);
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
    return new RemoteMIPViewport(option);
  }
}

export default RemoteMIPViewport;
