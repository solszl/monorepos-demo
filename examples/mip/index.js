import { TOOL_TYPE, ViewportManager } from "@pkg/entry/src";
import { Resource } from "@pkg/loader/src";
import Mip from "@pkg/viewer/src/algo/mip/mip";
const seriesId = "1.2.840.113704.7.32.07.5.1.4.76346.30000021052709540188000503559";
const fs = "http://10.0.70.3:8000";
let currentIndex = 0;
let step = 40;
const API = "/api/v1/series/";

const mip = new Mip();
const vm = new ViewportManager();
const resource = new Resource();

vm.resource = resource;
vm.resource.initTransfer([{ mode: "web" }]);
const standard = vm.addViewport({
  plane: "standard",
  renderer: "canvas",
  el: document.querySelector(".root"),
  alias: "axial",
  transferMode: "web",
  tools: [TOOL_TYPE.MOVE, TOOL_TYPE.ZOOM, TOOL_TYPE.STACK_SCROLL],
});

const fetchData = async (seriesId) => {
  const url = `${API}${seriesId}`;
  const json = await (await fetch(url)).json();
  return json;
};

fetchData(seriesId).then(async (json) => {
  const imageUrls = json.data.images.map((i) => {
    return `${fs}/${i.storagePath}`;
  });

  const { transferMode, alias } = standard.option;
  const transfer = resource.getTransfer(transferMode);
  transfer.addItemUrls(seriesId, imageUrls, alias);
  transfer.loadSeries(seriesId, alias);

  setTimeout(async () => {
    const image = await transfer.getImage(seriesId, currentIndex, alias);
    standard.imageView.showImage(image);
  }, 0);

  setTimeout(async () => {
    mip.method = "max";
    mip.imageList = transfer.getImages(seriesId, alias);
    const img = await mip.getImage(currentIndex, step);
    standard.imageView.showImage(img);
  }, 2000);
});

document.addEventListener("wheel", async (e) => {
  const offset = Math.sign(e.deltaY);
  currentIndex += offset;
  currentIndex = Math.max(0, Math.min(currentIndex, 182));
  const img = await mip.getImage(currentIndex, step);

  const { transferMode, alias } = standard.option;
  const transfer = resource.getTransfer(transferMode);
  transfer.cacheItem(seriesId, { key: currentIndex, value: img }, `${alias}-mip`);
  standard.imageView.showImage(img);

  console.log(currentIndex);
});

standard.useTool(TOOL_TYPE.STACK_WHEEL_SCROLL, 4);
