import AbstractRemoteDicomViewport from "./base/abstract-remote-dicom";

class RemoteMIPViewport extends AbstractRemoteDicomViewport {
  constructor(options = {}) {
    super(options);
    this.lastProps = [];
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
    this._azimuthChanged = true;
    this.renderSchedule.invalidate(this.propertyChanged, this);
    this.tryToPurgeCache();
  }

  setWithBone(val) {
    if (this.withBone === val) {
      return;
    }

    this.withBone = val;
    this._propertyChanged = true;
    this._withBoneChanged = true;
    this.renderSchedule.invalidate(this.propertyChanged, this);
    this.tryToPurgeCache();
  }

  setCount(val) {
    if (this.count === val || val < 0) {
      return;
    }

    this.count = val;
    this._propertyChanged = true;
    this._countChanged = true;
    this.renderSchedule.invalidate(this.propertyChanged, this);
    this.tryToPurgeCache();
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

    const {
      option: { seriesId, plane, resource },
    } = this;
    const transfer = resource.getTransfer("web");
    const img = transfer?.cacheManager.getItem(seriesId, this.index, plane);
    if (img) {
      this.currentShowIndex = this.index;
      this.showImage(img);
      return true;
    }

    // if (this._propertyChanged) {
    const respImg = await this.getMipImage(this.index, this.azimuth, this.count, this.withBone);
    if (respImg) {
      const { instanceNumber, seriesId: imgSeriesId } = respImg;
      const id = seriesId ?? imgSeriesId;
      transfer?.cacheManager.cacheItem(id, { key: instanceNumber - 1, value: respImg }, plane);
    }

    this.lastProps = [this.withBone, this.azimuth, this.index, this.count];
    this._propertyChanged = false;
    // }

    return true;
  }

  getImage(index) {
    this.setIndex(index);
  }

  async render() {
    await super.render();
    const {
      tracer,
      id,
      option: { plane },
    } = this;
    tracer.measure(tracer.key(id, plane, "mipRender"), "加载Mip图像到显示");
    return true;
  }

  tryToPurgeCache() {
    // 当切换带骨、方位、几合一的时候。需要把缓存清空
    const { _azimuthChanged: a, _countChanged: b, _withBoneChanged: c } = this;
    if (a || b || c) {
      const {
        option: { seriesId, plane, resource },
        index,
      } = this;
      // console.log("参数变更、清空缓存");
      const transfer = resource.getTransfer("web");
      transfer?.cacheManager.purge(seriesId, plane);
    }
    this._azimuthChanged = false;
    this._countChanged = false;
    this._withBoneChanged = false;
  }

  static create(option) {
    return new RemoteMIPViewport(option);
  }
}

export default RemoteMIPViewport;
