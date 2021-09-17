import { TOOL_TYPE, ViewportManager } from "@pkg/entry/src";
import { Resource } from "@pkg/loader/src";
import ToolBar from "./toolBar";
const seriesId = "1.2.840.113619.2.404.3.1074448704.467.1622952070.403";
const fs = "http://192.168.111.115:8000";
let currentIndex = 0;
let rotate = 0;
let invert = false;
let flipH = false;
let flipV = false;

const vm = new ViewportManager();
const resource = new Resource();

vm.resource = resource;

const standard = vm.addViewport({
  plane: "standard",
  renderer: "canvas",
  el: document.querySelector(".root"),
  transferMode: "web",
  alias: "axial",
  tools: [TOOL_TYPE.MOVE, TOOL_TYPE.ZOOM, TOOL_TYPE.STACK_SCROLL],
});

const fetchData = async (seriesId) => {
  const url = `/api/v1/series/${seriesId}`;
  const json = await (await fetch(url)).json();
  return json;
};

fetchData(seriesId).then(async (json) => {
  const imageUrls = json.data.images.map((i) => {
    return `${fs}/${i.storagePath}`;
  });

  await resource.initTransfer([{ mode: "web" }]);
  const { transferMode, alias } = standard.option;
  const transfer = resource.getTransfer(transferMode);
  transfer.addItemUrls(seriesId, imageUrls, alias);

  setTimeout(async () => {
    const image = await transfer.getImage(seriesId, currentIndex, alias);
    standard.imageView.showImage(image);
  }, 0);
});

standard.useTool(TOOL_TYPE.TRANSLATE, 2);
standard.useTool(TOOL_TYPE.SCALE, 3);
standard.useTool(TOOL_TYPE.STACK_WHEEL_SCROLL, 4);

const toolBar = new ToolBar({ root: "toolBar" });
toolBar.addBtn({
  name: "滚动",
  fun: () => standard.useTool(TOOL_TYPE.STACK_SCROLL, 1),
});

toolBar.addBtn({
  name: "移动",
  fun: () => standard.useTool(TOOL_TYPE.TRANSLATE, 1),
});
toolBar.addBtn({
  name: "缩放",
  fun: () => standard.useTool(TOOL_TYPE.SCALE, 1),
});
toolBar.addBtn({
  name: "放大镜",
  fun: () => standard.useTool(TOOL_TYPE.MAGNIFYING, 1),
});

toolBar.addBtn({
  name: "窗宽窗位",
  fun: () => standard.useTool(TOOL_TYPE.WWWC, 1),
});

toolBar.addBtn({
  name: "反色",
  fun: () => {
    invert = !invert;
    standard.useCmd("invert", invert);
  },
});

toolBar.addBtn({
  name: "水平翻转",
  fun: () => {
    flipH = !flipH;
    standard.useCmd("flipH", flipH);
  },
});

toolBar.addBtn({
  name: "垂直翻转",
  fun: () => {
    flipV = !flipV;
    standard.useCmd("flipV", flipV);
  },
});

toolBar.addBtn({
  name: "长度测量",
  fun: () => standard.useTool(TOOL_TYPE.LENGTH, 1),
});

toolBar.addBtn({
  name: "角度测量",
  fun: () => standard.useTool(TOOL_TYPE.ANGLE, 1),
});

toolBar.addBtn({
  name: "CT点值",
  fun: () => standard.useTool(TOOL_TYPE.PROBE, 1),
});
toolBar.addBtn({
  name: "区域CT",
  fun: () => standard.useTool(TOOL_TYPE.ELLIPSE_ROI, 1),
});

toolBar.addBtn({
  name: "旋转",
  fun: () => {
    rotate += 90;
    standard.useCmd("rotation", rotate % 360);
  },
});
toolBar.addBtn({
  name: "重置",
  fun: () => standard.useCmd("reset"),
});
