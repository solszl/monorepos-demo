import { ToolsMisc, ViewportManager } from "@pkg/entry/src";
import { Resource } from "@pkg/loader/src";
const { roi } = ToolsMisc;
const seriesId = "1.2.840.113619.2.416.194118337377523644320055354740023651573";
const fs = "http://172.16.3.20:8000/";
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
    ww: 90,
    wc: 45,
  },
  colormap: {
    name: "jet",
  },
  // config: {
  //   tools: {
  //     length: {
  //       suffixText: "aaa",
  //     },
  //     ellipse_roi: {
  //       minText: "哈哈哈",
  //     },
  //     ct: {
  //       ctText: "你猜猜",
  //     },
  //     wwwc: {
  //       wwStep: 0.1,
  //       wcStep: 0.1,
  //     },
  //   },
  // },
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
    "RESULT/5/TMAX/TMAX001.dcm",
    "RESULT/5/TMAX/TMAX002.dcm",
    "RESULT/5/TMAX/TMAX003.dcm",
    "RESULT/5/TMAX/TMAX004.dcm",
    "RESULT/5/TMAX/TMAX005.dcm",
    "RESULT/5/TMAX/TMAX006.dcm",
    "RESULT/5/TMAX/TMAX007.dcm",
    "RESULT/5/TMAX/TMAX008.dcm",
    "RESULT/5/TMAX/TMAX009.dcm",
    "RESULT/5/TMAX/TMAX010.dcm",
    "RESULT/5/TMAX/TMAX011.dcm",
    "RESULT/5/TMAX/TMAX012.dcm",
    "RESULT/5/TMAX/TMAX013.dcm",
    "RESULT/5/TMAX/TMAX014.dcm",
    "RESULT/5/TMAX/TMAX015.dcm",
    "RESULT/5/TMAX/TMAX016.dcm",
    "RESULT/5/TMAX/TMAX017.dcm",
    "RESULT/5/TMAX/TMAX018.dcm",
    "RESULT/5/TMAX/TMAX019.dcm",
    "RESULT/5/TMAX/TMAX020.dcm",
    "RESULT/5/TMAX/TMAX021.dcm",
    "RESULT/5/TMAX/TMAX022.dcm",
    "RESULT/5/TMAX/TMAX023.dcm",
    "RESULT/5/TMAX/TMAX024.dcm",
    "RESULT/5/TMAX/TMAX025.dcm",
    "RESULT/5/TMAX/TMAX026.dcm",
    "RESULT/5/TMAX/TMAX027.dcm",
    "RESULT/5/TMAX/TMAX028.dcm",
    "RESULT/5/TMAX/TMAX029.dcm",
    "RESULT/5/TMAX/TMAX030.dcm",
    "RESULT/5/TMAX/TMAX031.dcm",
    "RESULT/5/TMAX/TMAX032.dcm",
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
    // const image = await transfer.getImage(seriesId, currentIndex, alias);
    // standard.imageView.showImage(image);

    standard.showImage(seriesId, currentIndex);
  }, 0);
});

// document.addEventListener("wheel", async (e) => {
//   let offset = Math.sign(e.wheelDelta);
//   currentIndex += offset;
//   const { resource } = vm;
//   const { transferMode, alias } = standard.option;
//   const transfer = resource.getTransfer(transferMode);
//   const image = await transfer.getImage(seriesId, currentIndex, alias);
//   standard.imageView.showImage(image);
// });

standard.useTool("stack_wheel_scroll", 4);
standard.useTool("roi");

// standard.useTool("ellipse_roi");
// standard.on("tool_data_updated", (data) => {
//   console.log(data);
//   const img = standard.imageView.image;
//   const d = data.data;

//   const result = roi(img, d);
//   console.log(result);
// });
