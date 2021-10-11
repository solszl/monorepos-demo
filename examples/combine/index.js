import { Resource, TOOL_TYPE, ViewportManager } from "@pkg/entry/src";
import CombineImage from "./combine";
const seriesId = "1.2.840.113619.2.404.3.1074448704.467.1622952070.403";
const fs = "http://192.168.108.95:8887/";
let currentIndex = 0;
let combine;

const vm = new ViewportManager();
const resource = new Resource();

vm.resource = resource;
const standard = vm.addViewport({
  plane: "standard",
  renderer: "canvas",
  el: document.querySelector(".root"),
  alias: "axial",
  transferMode: "web",
});

const main = async () => {
  const imageUrls = new Array(999).fill().map((_, i) => {
    return `${fs}${i.toString().padStart(3, 0)}.dcm`;
  });

  const resource = vm.resource;
  await resource.initTransfer([{ mode: "web" }]);
  const { transferMode, alias } = standard.option;
  const transfer = resource.getTransfer(transferMode);
  transfer.addItemUrls(seriesId, imageUrls, alias);

  combine = new CombineImage();
  setTimeout(async () => {
    // 一个数据合并需求，每个影像占用RGB通道中的一种， 一次选取3张图进行图像合并。然后进行显示
    const image0 = await transfer.getImage(seriesId, currentIndex, alias);
    const image1 = await transfer.getImage(seriesId, currentIndex + 1, alias);
    const image2 = await transfer.getImage(seriesId, currentIndex + 2, alias);
    console.log(image0, image1, image2);
    const targetImage = combine.execute([image0, image1, image2]);
    standard.imageView.showImage(targetImage);

    // await standard.showImage(seriesId, 20);
  }, 0);
};

standard.useTool(TOOL_TYPE.LENGTH, 1);
standard.useTool(TOOL_TYPE.TRANSLATE, 2);
standard.useTool(TOOL_TYPE.SCALE, 3);
// standard.useTool(TOOL_TYPE.STACK_WHEEL_SCROLL, 4);
console.log("fuse start.", vm);

document.addEventListener("wheel", async (e) => {
  currentIndex += Math.sign(e.deltaY) * 3;
  const { transferMode, alias } = standard.option;
  const transfer = resource.getTransfer(transferMode);
  const image0 = await transfer.getImage(seriesId, currentIndex, alias);
  const image1 = await transfer.getImage(seriesId, currentIndex + 1, alias);
  const image2 = await transfer.getImage(seriesId, currentIndex + 2, alias);
  const targetImage = combine.execute([image0, image1, image2]);
  standard.imageView.showImage(targetImage);
});

main();
