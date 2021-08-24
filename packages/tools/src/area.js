import Transform from "./transform";

class Area {
  constructor(config = {}) {
    if (Reflect.ownKeys(config).length) {
      this.update(config);
    }
  }

  update(config) {
    const { rootSize, offset, scale, rotation } = config;
    // 设置视窗
    Object.assign(viewState, rootSize ?? {});
    Object.assign(viewState, offset ?? {});
    Object.assign(viewState, scale ?? {});
    Object.assign(viewState, rotation ?? {});

    // TODO: update transform
  }
}

export const transform = new Transform();

export const viewState = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  rotate: 0,
  scale: 1,
  rootWidth: 0,
  rootHeight: 0,
  centerX: 0,
  centerY: 0,
};

export const verify = (x, y) => {
  const [ox, oy] = transform.invertPoint(x, y);
  // TODO: 根据viewState 判断是否在内部
  return true;
};

export default Area;
