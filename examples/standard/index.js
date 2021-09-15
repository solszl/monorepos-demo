import { ViewportManager } from "@saga/entry";
import { Resource } from "@saga/loader";
const seriesId = "1.3.46.670589.33.1.63759620259124964400001.4675988079426718788";
const fs = "http://192.168.111.115:8000";
let currentIndex = 10;
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
});

const fetchData = async (seriesId) => {
  const url = `${API_GRAY}${seriesId}`;
  const json = await (await fetch(url)).json();
  return json;
};

fetchData(seriesId).then(async (json) => {
  const imageUrls = json.data.images.map((i) => {
    return `${fs}/${i.storagePath}`;
  });

  // let obj = json.data.displayImages.VR.azimuth;
  // const imageUrls = Object.keys(obj)
  //   .sort((a, b) => a - b)
  //   .map((key) => {
  //     return `${fs}/${obj[key]}`;
  //   });
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
