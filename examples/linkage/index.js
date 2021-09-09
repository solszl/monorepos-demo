import { LINK_PROPERTY, TOOL_TYPE, ViewportManager } from "@saga/entry";
import { Resource } from "@saga/loader";
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
  el: document.querySelector("#id1"),
  tools: [TOOL_TYPE.MOVE, TOOL_TYPE.ZOOM, TOOL_TYPE.STACK_SCROLL],
});

const standard2 = vm.addViewport({
  plane: "standard",
  renderer: "canvas",
  el: document.querySelector("#id2"),
  tools: [TOOL_TYPE.MOVE, TOOL_TYPE.ZOOM, TOOL_TYPE.STACK_SCROLL],
});

const standard3 = vm.addViewport({
  plane: "standard",
  renderer: "canvas",
  el: document.querySelector("#id3"),
  tools: [TOOL_TYPE.MOVE, TOOL_TYPE.ZOOM, TOOL_TYPE.STACK_SCROLL],
});

const standard4 = vm.addViewport({
  plane: "standard",
  renderer: "canvas",
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

fetchData(seriesId).then((json) => {
  const imageUrls = json.data.images.map((i) => {
    return `${fs}/${i.storagePath}`;
  });

  resource.addItemUrls(seriesId, imageUrls, "standard");

  setTimeout(async () => {
    const image1 = await resource.getImage(seriesId, currentIndex, "standard");
    standard1.imageView.showImage(image1);
    const image2 = await resource.getImage(seriesId, currentIndex + 30, "standard");
    standard2.imageView.showImage(image2);
    const image3 = await resource.getImage(seriesId, currentIndex, "standard");
    standard3.imageView.showImage(image3);
    const image4 = await resource.getImage(seriesId, currentIndex + 30, "standard");
    standard4.imageView.showImage(image4);
  }, 0);
});

console.log("fuse start.", vm);
