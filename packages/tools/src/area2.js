import { useViewportState } from "./state/viewport-state";
import Transform from "./transform";

class Area {
  constructor(config = {}) {
    if (Reflect.ownKeys(config).length) {
      this.update(config);
    }

    this.transform = new Transform();
  }

  update(config) {
    const [state, setViewportState] = useViewportState(this.stageId);
    setViewportState(Object.assign({}, state(), config, { stageId: this.stageId }));

    // 初始化时缩放和reander同时触发，判断是否有transform所需数据
    this._applyTransform(this.stageId);
  }

  verify = (x, y, width, height) => {
    const { transform } = this;
    const [ox, oy] = transform.invertPoint(x, y);
    return ox >= 0 && ox <= width && oy >= 0 && oy <= height;
  };

  _applyTransform(stageId) {
    const [viewportState] = useViewportState(stageId);
    const { scale, rotate, flip, width, height, x, y, rootWidth, rootHeight } = viewportState();
    const { transform } = this;

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
  }
}

export default Area;
