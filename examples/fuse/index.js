import { ViewportManager, TOOL_TYPE } from "@saga/entry";
import { Resource } from "@saga/loader";
const seriesId = "1.2.840.113619.2.404.3.1074448704.467.1622952070.403";
const fs = "http://192.168.111.115:8000";
let currentIndex = 0;

const vm = new ViewportManager();
const resource = new Resource();

vm.resource = resource;
const standard = vm.addViewport({
  plane: "standard",
  renderer: "canvas",
  el: document.querySelector(".root"),
  tools: [TOOL_TYPE.MOVE, TOOL_TYPE.ZOOM, TOOL_TYPE.STACK_SCROLL],
});

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
    const image = await resource.getImage(seriesId, currentIndex, "standard");
    standard.imageView.showImage(image);
  }, 0);
});

standard.useTool("ellipse_roi", 1);
standard.useTool("stack_wheel_scroll", 2);
standard.useTool("scale", 3);
console.log("fuse start.", vm);
