import { useViewportState } from "./state/viewport-state";
import Transform from "./transform";
export const transform = new Transform();

const applyTransform = (stageId) => {
  const [viewportState] = useViewportState(stageId);
  const { scale, rotate, flip, width, height, x, y, rootWidth, rootHeight } = viewportState();

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

export const verify = (x, y, width, height) => {
  const [ox, oy] = transform.invertPoint(x, y);
  return ox >= 0 && ox <= width && oy >= 0 && oy <= height;
};

class Area {
  constructor(config = {}) {
    if (Reflect.ownKeys(config).length) {
      this.update(config);
    }
  }

  update(config) {
    const [viewportState, setViewportState] = useViewportState(this.stageId);
    setViewportState(Object.assign({}, config, { stageId: this.stageId }));

    // console.log(viewportState());
    // 初始化时缩放和reander同时触发，判断是否有transform所需数据
    applyTransform(this.stageId);
  }
}

export default Area;
