import { TOOL_TYPE, ViewportManager } from "@saga/entry";
import { Resource } from "@saga/loader";
let currentIndex = 0;

const vm = new ViewportManager();
const standard = vm.addViewport({
  plane: "standard",
  renderer: "canvas",
  transferMode: "web",
  alias: "webImage",
  el: document.querySelector(".root"),
  tools: [TOOL_TYPE.MOVE, TOOL_TYPE.ZOOM, TOOL_TYPE.STACK_SCROLL],
});

const resource = new Resource();
vm.resource = resource;

const imageUrls = [
  "https://rawgit.com/cornerstonejs/cornerstoneWebImageLoader/master/examples/Renal_Cell_Carcinoma.jpg",
];

const seriesId = "1.2.3.4.5";

const main = async () => {
  const { transferMode: mode, alias } = standard.option;
  await resource.initTransfer([{ mode }]);
  const transfer = resource.getTransfer(mode);
  transfer.addItemUrls(seriesId, imageUrls, alias, "webimage");

  setTimeout(async () => {
    const image = await transfer.getImage(seriesId, currentIndex, alias);
    standard.imageView.showImage(image);
  }, 0);

  standard.useTool("length");
  standard.useTool("scale", 3);
};

main();
