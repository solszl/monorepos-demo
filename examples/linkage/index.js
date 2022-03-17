import { LINK_PROPERTY, Resource, TOOL_TYPE, ViewportManager } from "@pkg/entry/src";
import { LINK_DATA_PROPERTY } from "../../packages/entry/src/linkage-manager";
import { MOUSE_BUTTON } from "../../packages/tools/src/constants";
import ToolBar from "../toolbar/toolBar";

const seriesId = "1.2.840.113619.2.437.3.2831215364.545.1555459452.845";
const fs = "http://172.16.3.35:8000";
let currentIndex = 0;

const vm = new ViewportManager();
const resource = new Resource();

vm.resource = resource;
const standard1 = vm.addViewport({
  plane: "standard",
  renderer: "canvas",
  alias: "axial",
  transferMode: "web",
  el: document.querySelector("#id1"),
  tools: [TOOL_TYPE.MOVE, TOOL_TYPE.ZOOM, TOOL_TYPE.STACK_SCROLL],
  wwwc: {
    ww: 1300,
    wc: 500,
  },
});

const standard2 = vm.addViewport({
  plane: "standard",
  renderer: "canvas",
  alias: "axial",
  transferMode: "web",
  el: document.querySelector("#id2"),
  tools: [TOOL_TYPE.MOVE, TOOL_TYPE.ZOOM, TOOL_TYPE.STACK_SCROLL],
});

const standard3 = vm.addViewport({
  plane: "standard",
  renderer: "canvas",
  alias: "axial",
  transferMode: "web",
  el: document.querySelector("#id3"),
  tools: [TOOL_TYPE.MOVE, TOOL_TYPE.ZOOM, TOOL_TYPE.STACK_SCROLL],
});

const standard4 = vm.addViewport({
  plane: "standard",
  renderer: "canvas",
  alias: "axial",
  transferMode: "web",
  el: document.querySelector("#id4"),
  tools: [TOOL_TYPE.MOVE, TOOL_TYPE.ZOOM, TOOL_TYPE.STACK_SCROLL],
});

vm.linkManager.link([standard1.id, standard2.id], [LINK_PROPERTY.SCALE]);
vm.linkManager.link([standard2.id, standard3.id], [LINK_PROPERTY.WWWC]);
vm.linkManager.link([standard3.id, standard4.id], [LINK_PROPERTY.SCALE]);
vm.linkManager.link(
  [standard1.id, standard2.id, standard3.id, standard4.id],
  [LINK_PROPERTY.SLICE],
  [LINK_DATA_PROPERTY.ROI]
);

const fetchData = async (seriesId) => {
  const url = `/api/v1/series/${seriesId}`;
  const json = await (await fetch(url)).json();
  return json;
};

fetchData(seriesId).then(async (json) => {
  const imageUrls = json.data.images.map((i) => {
    return `${fs}/${i.storagePath}`;
  });

  const resource = vm.resource;
  await resource.initTransfer([{ mode: "web" }]);
  const { transferMode, alias } = standard1.option;
  const transfer = resource.getTransfer(transferMode);
  transfer.addItemUrls(seriesId, imageUrls, alias);

  setTimeout(async () => {
    await standard1.showImage(seriesId, currentIndex);
    await standard2.showImage(seriesId, currentIndex);
    await standard3.showImage(seriesId, currentIndex);
    await standard4.showImage(seriesId, currentIndex);
  }, 0);
});

console.log("fuse start.", vm);
const toolbar = new ToolBar({ root: "toolBar" });
const views = [standard1, standard2, standard3, standard4];
toolbar.addBtn({
  name: "缩放",
  fun: () => {
    views.forEach((view) => view.useTool(TOOL_TYPE.SCALE, 1));
  },
});

toolbar.addBtn({
  name: "调窗",
  fun: () => {
    views.forEach((view) => view.useTool(TOOL_TYPE.WWWC, 1));
  },
});

toolbar.addBtn({
  name: "ROI",
  fun: () => {
    views.forEach((view) => view.useTool(TOOL_TYPE.ROI, 1));
  },
});

toolbar.addBtn({
  name: "长度",
  fun: () => {
    views.forEach((view) => view.useTool(TOOL_TYPE.LENGTH, 1));
  },
});
toolbar.addBtn({
  name: "滚动",
  fun: () => {
    views.forEach((view) => {
      view.useTool(TOOL_TYPE.STACK_SCROLL, MOUSE_BUTTON.RIGHT);
      view.useTool(TOOL_TYPE.STACK_WHEEL_SCROLL, MOUSE_BUTTON.WHEEL);
    });
  },
});
