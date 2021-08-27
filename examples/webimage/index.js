import { ViewportManager, TOOL_TYPE } from "@saga/entry";
import { Resource } from "@saga/loader";
let currentIndex = 0;

const vm = new ViewportManager();
const standard = vm.addViewport({
  plane: "standard",
  renderer: "canvas",
  el: document.querySelector(".root"),
  tools: [TOOL_TYPE.MOVE, TOOL_TYPE.ZOOM, TOOL_TYPE.STACK_SCROLL],
});

const resource = new Resource();

const imageUrls = [
  "https://rawgit.com/cornerstonejs/cornerstoneWebImageLoader/master/examples/Renal_Cell_Carcinoma.jpg",
];

const seriesId = "1.2.3.4.5";

resource.addItemUrls(seriesId, imageUrls, "standard", "webimage");

setTimeout(async () => {
  const image = await resource.getImage(seriesId, currentIndex, "standard");
  standard.imageView.showImage(image);
}, 0);

standard.useTool("length");
standard.useTool("scale", 3);
