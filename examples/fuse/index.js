import { ViewportManager, TOOL_TYPE } from "@saga/entry";
import { Resource } from "@saga/loader";
const seriesId =
  "1.3.46.670589.33.1.63758828404033474900002.5256280429442842630";
const fs = "http://192.168.111.115:8000";
let currentIndex = 10;

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

standard.useTool("stack_scroll", 1);
standard.useTool("stack_wheel_scroll", 2);
standard.useTool("scale", 3);
console.log("fuse start.", vm);
