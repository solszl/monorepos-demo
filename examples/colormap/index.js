import { ToolsMisc, ViewportManager } from "@pkg/entry/src";
import { Resource } from "@pkg/loader/src";
const { roi } = ToolsMisc;
const seriesId = "1.2.392.200036.9116.2.1796265406.1637200042.8.1201900001.2";
const fs = "http://10.0.80.32:8887/";
let currentIndex = 9;
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
  wwwc: {
    ww: 95,
    wc: 50,
  },
  colormap: {
    name: "turbo",
  },
  // disableTools: [TOOL_TYPE.WWWC],
});

window.viewport = standard;

const fetchData = async (seriesId) => {
  const url = `${API_GRAY}${seriesId}`;
  const json = await (await fetch(url)).json();
  return json;
};

fetchData(seriesId).then(async (json) => {
  // const imageUrls = ["http://10.0.80.32:8887/SE10.dcm"];

  const imageUrls = [
    "TTP/TTP001.dcm",
    "TTP/TTP002.dcm",
    "TTP/TTP003.dcm",
    "TTP/TTP004.dcm",
    "TTP/TTP005.dcm",
    "TTP/TTP006.dcm",
    "TTP/TTP007.dcm",
    "TTP/TTP008.dcm",
    "TTP/TTP009.dcm",
    "TTP/TTP010.dcm",
    "TTP/TTP011.dcm",
    "TTP/TTP012.dcm",
    "TTP/TTP013.dcm",
    "TTP/TTP014.dcm",
    "TTP/TTP015.dcm",
    "TTP/TTP016.dcm",
    "TTP/TTP017.dcm",
    "TTP/TTP018.dcm",
    "TTP/TTP019.dcm",
    "TTP/TTP020.dcm",
    "TTP/TTP021.dcm",
    "TTP/TTP022.dcm",
    "TTP/TTP023.dcm",
    "TTP/TTP024.dcm",
    "TTP/TTP025.dcm",
    "TTP/TTP026.dcm",
    "TTP/TTP027.dcm",
    "TTP/TTP028.dcm",
    "TTP/TTP029.dcm",
    "TTP/TTP030.dcm",
    "TTP/TTP031.dcm",
    "TTP/TTP032.dcm",
  ].map((i) => {
    return `${fs}/${i}`;
  });
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
// standard.useTool("ellipse_roi");
// standard.on("tool_data_updated", (data) => {
//   console.log(data);
//   const img = standard.imageView.image;
//   const d = data.data;

//   const result = roi(img, d);
//   console.log(result);
// });
