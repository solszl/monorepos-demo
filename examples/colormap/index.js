import { TOOL_TYPE, ViewportManager } from "@pkg/entry/src";
import { Resource } from "@pkg/loader/src";
const seriesId = "1.2.392.200036.9116.2.1796265406.1637200042.8.1201900001.2";
const fs = "http://10.0.70.3:8000";
let currentIndex = 0;
const API_GRAY = "/api/v1/series/";
const API_COLOR = "/api/v1/series/ssr/";

const vm = new ViewportManager();
vm.resource = new Resource();

const standard = vm.addViewport({
  plane: "standard",
  renderer: "canvas",
  alias: "axial",
  transferMode: "web",
  el: document.querySelector("#root"),
  colormap: {
    name: "RdYlBu",
    reverse: false,
  },
  disableTools: [TOOL_TYPE.WWWC],
});

window.viewport = standard;

const fetchData = async (seriesId) => {
  const url = `${API_GRAY}${seriesId}`;
  const json = await (await fetch(url)).json();
  return json;
};

fetchData(seriesId).then(async (json) => {
  const imageUrls = ["http://10.0.80.32:8887/SE10.dcm"];
  // const imageUrls = json.data.images.map((i) => {
  //   return `${fs}/${i.storagePath}`;
  // });

  const resource = vm.resource;
  await resource.initTransfer([{ mode: "web" }]);
  const { transferMode, alias } = standard.option;
  const transfer = resource.getTransfer(transferMode);
  transfer.addItemUrls(seriesId, imageUrls, alias);

  setTimeout(async () => {
    const image = await transfer.getImage(seriesId, currentIndex, alias);
    standard.imageView.showImage(image);
  }, 0);
});

document.addEventListener("wheel", async (e) => {
  let offset = Math.sign(e.wheelDelta);
  currentIndex += offset;
  const { resource } = vm;
  const { transferMode, alias } = standard.option;
  const transfer = resource.getTransfer(transferMode);
  const image = await transfer.getImage(seriesId, currentIndex, alias);
  standard.imageView.showImage(image);
});
