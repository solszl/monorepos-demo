import Transform from "./transform";

class Area {
  constructor(config = {}) {
    if (Reflect.ownKeys(config).length) {
      this.update(config);
    }
  }

  update(config) {
    const { rootSize, offset, scale, rotate, width, height } = config;
    // 设置视窗
    Object.assign(viewState, { rootWidth: rootSize.width, rootHeight: rootSize.height } ?? {});
    Object.assign(viewState, { x: offset[0], y: offset[1] } ?? {});
    Object.assign(viewState, { scale } ?? {});
    Object.assign(viewState, { rotate } ?? {});
    Object.assign(viewState, { width } ?? {});
    Object.assign(viewState, { height } ?? {});
    Object.assign(viewState, { centerX: width / 2, centerY: height / 2 } ?? {});

    // TODO: update transform
    applyTransform()
  }
}

export const transform = new Transform();


const applyTransform = () => {
  const { scale, rotate, flip, width, height, x, y, rootWidth, rootHeight } = viewState;

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
  const { width, height, scale, rootWidth, rootHeight } = viewState;
  // TODO: 根据viewState 判断是否在内部
  const newWidth = width * scale;
  const newHeight = height * scale;


  const startX = (rootWidth - newWidth) / 2;
  const endX = startX + newWidth;
  const startY = (rootHeight - newHeight) / 2;
  const endY = startY + newHeight;

  console.log("1",startX, endX, startY, endY);
  console.log("2",x,y,ox, oy);

  // return (ox >= startX && ox <= endX) && (oy >= startY && oy <= endY);
  return ox >=0 && ox<=width && oy>=0 && oy<=height

};

export default Area;
