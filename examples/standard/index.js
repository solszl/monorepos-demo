import { ViewportManager } from "@pkg/entry/src";
import { Resource } from "@pkg/loader/src";
const seriesId = "1.3.46.670589.33.1.63759620259124964400001.4675988079426718788";
const fs = "http://192.168.111.115:8000";
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
});

const fetchData = async (seriesId) => {
  const url = `${API_GRAY}${seriesId}`;
  const json = await (await fetch(url)).json();
  return json;
};

// fetchData(seriesId).then(async (json) => {
//   const imageUrls = json.data.images.map((i) => {
//     return `${fs}/${i.storagePath}`;
//   });

const main = async () => {
  const imageUrls = [
    "http://10.0.70.3:8000/ct_heart/4487824/1.2.124.113532.55507.34297.41430.20190318.134932.89059128/1.3.12.2.1107.5.1.4.74356.30000019031800002060400067195/1.3.12.2.1107.5.1.4.74356.30000019031800002060400067348",
  ];
  const resource = vm.resource;
  await resource.initTransfer([{ mode: "web" }]);
  const { transferMode, alias } = standard.option;
  const transfer = resource.getTransfer(transferMode);
  transfer.addItemUrls(seriesId, imageUrls, alias);

  setTimeout(async () => {
    const image = await transfer.getImage(seriesId, currentIndex, alias);
    standard.imageView.showImage(image);
  }, 0);
  // });
};
document.addEventListener("wheel", async (e) => {
  let offset = Math.sign(e.wheelDelta);
  currentIndex += offset;
  const { resource } = vm;
  const { transferMode, alias } = standard.option;
  const transfer = resource.getTransfer(transferMode);
  const image = await transfer.getImage(seriesId, currentIndex, alias);
  standard.imageView.showImage(image);
});

main();
