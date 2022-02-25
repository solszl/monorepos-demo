import AbstractRemoteDicomViewport from "./base/abstract-remote-dicom";
class RemoteProbeViewport extends AbstractRemoteDicomViewport {
  constructor(option = {}) {
    super(option);
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

  setVesselName(name) {
    if (!name || this.vesselName === name) {
      return;
    }

    this.vesselNameChanged = true;
    this.vesselName = name;
    this.renderSchedule.invalidate(this.propertyChanged, this);
  }

  setIndex(index) {
    if (index < 0 || this.index === index) {
      return;
    }

    this.indexChanged = true;
    this.index = index;
    this.renderSchedule.invalidate(this.propertyChanged, this);
  }

  async propertyChanged() {
    await super.propertyChanged();
    if (this.vesselNameChanged || this.indexChanged) {
      const { vesselName, index } = this;
      const data = await this?.getProbeImage(vesselName, index);
      const uri = data[0];
      const { httpServer } = this.option;
      this.setUrl(`${httpServer}${uri}`);

      this.vesselNameChanged = false;
      this.indexChanged = false;
    }
  }

  static create(option) {
    return new RemoteProbeViewport(option);
  }
}

export default RemoteProbeViewport;
