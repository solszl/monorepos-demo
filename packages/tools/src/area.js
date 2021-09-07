import { viewportState } from "./state/viewport-state";
import Transform from "./transform";
export const transform = new Transform();

const applyTransform = () => {
  const { scale, rotate, flip, width, height, x, y, rootWidth, rootHeight } = viewportState;

  transform.reset();

  if (x || y) {
    transform.translate(x, y);
  }

  transform.translate(rootWidth / 2, rootHeight / 2);

  if (flip) {
    const { h = false, v = false } = flip;
    const fv = v ? -1 : 1;
    const fh = h ? -1 : 1;
    transform.scale(fh, fv);
  }

  if (!!scale) {
    transform.scale(scale, scale);
  }

  if (!!rotate) {
    transform.rotate(rotate);
  }

  transform.translate(-width / 2, -height / 2);

  return transform.m;
};

export const verify = (x, y) => {
  const [ox, oy] = transform.invertPoint(x, y);
  const { width, height } = viewportState;
  return ox >= 0 && ox <= width && oy >= 0 && oy <= height;
};

class Area {
  constructor(config = {}) {
    if (Reflect.ownKeys(config).length) {
      this.update(config);
    }
  }

  update(config) {
    const { rootSize, scale, rotate, width, height, position = [0, 0], offset, flip } = config;

    // 设置视窗
    Object.assign(viewportState, { rootWidth: rootSize?.width, rootHeight: rootSize?.height } ?? {});
    Object.assign(viewportState, { x: offset.x, y: offset.y } ?? {});
    Object.assign(viewportState, { scale } ?? {});
    Object.assign(viewportState, { rotate } ?? {});
    Object.assign(viewportState, { width } ?? {});
    Object.assign(viewportState, { height } ?? {});
    Object.assign(viewportState, { centerX: width / 2, centerY: height / 2 } ?? {});
    Object.assign(viewportState, { position } ?? {});
    Object.assign(viewportState, { flip } ?? {});

    // 初始化时缩放和reander同时触发，判断是否有transform所需数据
    rootSize && applyTransform();
  }
}

export default Area;
