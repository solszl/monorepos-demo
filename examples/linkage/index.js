import { LINK_PROPERTY, Resource, TOOL_TYPE, ViewportManager } from "@saga/entry";
import ToolBar from "../toolbar/toolBar";
const toolbar = new ToolBar({ root: "toolBar" });
toolbar.addBtn({
  name: "缩放",
  fun: () => {
    standard1.useTool(TOOL_TYPE.SCALE, 1);
    standard2.useTool(TOOL_TYPE.SCALE, 1);
    standard3.useTool(TOOL_TYPE.SCALE, 1);
    standard4.useTool(TOOL_TYPE.SCALE, 1);
  },
});

toolbar.addBtn({
  name: "调窗",
  fun: () => {
    standard1.useTool(TOOL_TYPE.WWWC, 1);
    standard2.useTool(TOOL_TYPE.WWWC, 1);
    standard3.useTool(TOOL_TYPE.WWWC, 1);
    standard4.useTool(TOOL_TYPE.WWWC, 1);
  },
});

const seriesId = "1.2.840.113619.2.404.3.1074448704.467.1622952070.403";
const fs = "http://192.168.111.115:8000";
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
    const image1 = await transfer.getImage(seriesId, currentIndex, alias);
    standard1.imageView.showImage(image1);
    const image2 = await transfer.getImage(seriesId, currentIndex + 30, alias);
    standard2.imageView.showImage(image2);
    const image3 = await transfer.getImage(seriesId, currentIndex, alias);
    standard3.imageView.showImage(image3);
    const image4 = await transfer.getImage(seriesId, currentIndex + 30, alias);
    standard4.imageView.showImage(image4);
  }, 0);
});

console.log("fuse start.", vm);
