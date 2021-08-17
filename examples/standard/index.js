import { Core } from "@saga/core";
import { Resource } from "@saga/loader";
import { Volume, Plane, ObliqueSampler, factory as ViewFactory } from "@saga/viewer";
const seriesId = "1.2.392.200036.9116.2.1796265406.1623117451.14.1085300005.1";
const fs = "http://192.168.111.115:8000";
let currentIndex = 10;
const API_GRAY = "/api/v1/series/";
const API_COLOR = "/api/v1/series/ssr/";

const core = new Core({ fps: 10 });
const resource = new Resource();

const standard = ViewFactory({
  plane: "standard",
  renderer: "canvas",
  el: document.querySelector("#root"),
  core,
});

const fetchData = async (seriesId) => {
  const url = `${API_GRAY}${seriesId}`;
  const json = await (await fetch(url)).json();
  return json;
};

fetchData(seriesId).then((json) => {
  const imageUrls = json.data.images.map((i) => {
    return `${fs}/${i.storagePath}`;
  });

  // let obj = json.data.displayImages.VR.azimuth;
  // const imageUrls = Object.keys(obj)
  //   .sort((a, b) => a - b)
  //   .map((key) => {
  //     return `${fs}/${obj[key]}`;
  //   });

  resource.addItemUrls(seriesId, imageUrls, "standard");

  setTimeout(async () => {
    const image = await resource.getImage(seriesId, currentIndex, "standard");
    standard.showImage(image);
  }, 0);
});

document.addEventListener("wheel", async (e) => {
  let offset = Math.sign(e.wheelDelta);
  currentIndex += offset;
  const image = await resource.getImage(seriesId, currentIndex, "standard");
  standard.showImage(image);
});
