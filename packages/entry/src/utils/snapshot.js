import { delay } from "./delay";
/**
 * 所见即所得截图模式，即当前网页缩放后，dom元素有多大， 就截取多大的可视区域
 * @param { HTMLElement } el 挂载的根元素
 * @returns
 */
export const snapshotMode1 = (el) => {
  const { clientWidth, clientHeight } = el;
  const canvas = document.createElement("canvas");
  canvas.width = clientWidth;
  canvas.height = clientHeight;
  const ctx = canvas.getContext("2d");
  const canvasList = el.querySelectorAll("canvas");
  for (var c of canvasList) {
    ctx.drawImage(c, 0, 0);
  }

  return canvas;
};

/**
 * 图像原始大小模式， 无论显示的多大。将其还原成影像原始大小。然后将canvas返回
 * @param {*} config
 * @returns
 */
export const snapshotMode2 = async (config) => {
  const { imageView, toolView, sliceKey, data, showTypes } = config;
  const { image, renderer } = imageView;
  const { columns, rows } = image;
  const canvas = document.createElement("canvas");
  canvas.width = columns;
  canvas.height = rows;
  canvas.id = "temporary";
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, columns, rows);
  ctx.imageSmoothingEnabled = true;

  if (renderer?.renderData) {
    ctx.drawImage(renderer.renderData, 0, 0);
  }

  const sliceData = data?.[sliceKey] ?? new Map();
  const filteredData = sliceData.filter((data) => {
    return showTypes.includes(data.type);
  });
  toolView.renderData(filteredData);

  // 要重绘的区域
  let c2 = toolView.getCanvas();
  let offsetX = 0;
  let offsetY = 0;
  const { width, height } = c2;
  let minSize = Math.min(width, height);
  if (width > height) {
    offsetX = (width - height) / 2;
  } else if (height > width) {
    offsetY = (height - width) / 2;
  }
  ctx.drawImage(c2, offsetX, offsetY, minSize, minSize, 0, 0, columns, rows);

  // 等一会
  await delay(10);
  toolView.renderData(sliceData);

  // const base64 = canvas.toDataURL("image/png");
  // const a = document.createElement("a");
  // a.href = base64;
  // a.setAttribute("download", "aaa");
  // a.click();
  return canvas;
};
