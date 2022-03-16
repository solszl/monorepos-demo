import AbstractRemoteDicomViewport from "./base/abstract-remote-dicom";

class RemoteMIPViewport extends AbstractRemoteDicomViewport {
  constructor(options = {}) {
    super(options);
    this.lastIndex = -1;
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

  setAzimuth(val) {
    if (!val || val === this.azimuth) {
      return;
    }

    this.azimuth = val;
    this._propertyChanged = true;
    this.renderSchedule.invalidate(this.propertyChanged, this);
  }

  setWithBone(val) {
    if (this.withBone === val) {
      return;
    }

    this.withBone = val;
    this._propertyChanged = true;
    this.renderSchedule.invalidate(this.propertyChanged, this);
  }

  setCount(val) {
    if (this.count === val || val < 0) {
      return;
    }

    this.count = val;
    this._propertyChanged = true;
    this.renderSchedule.invalidate(this.propertyChanged, this);
  }

  setIndex(val) {
    if (this.index === val || val < 0 || val >= this.total) {
      return;
    }

    this.index = val;
    this._propertyChanged = true;
    this.renderSchedule.invalidate(this.propertyChanged, this);
  }

  setTotal(val) {
    this.total = val;
  }

  async propertyChanged() {
    await super.propertyChanged();

    if (this._propertyChanged) {
      const { withBone, azimuth, index, count } = this;
      if (index === this.lastIndex) {
        this._propertyChanged = false;
        return;
      }

      await this.getMipImage(index, azimuth, count, withBone);
      this.lastIndex = index;
      this._propertyChanged = false;
    }
  }

  getImage(index) {
    this.setIndex(index);
  }

  static create(option) {
    return new RemoteMIPViewport(option);
  }
}

export default RemoteMIPViewport;
