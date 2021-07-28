import { Core } from "@saga/core";
import ViewportManager from "../../packages/viewer/src";
import { Resource } from "@saga/loader";
import { Volume } from "@saga/viewer";
const seriesId = "1.2.840.113704.7.32.07.5.1.4.76346.30000021060408361231300076202";
const fs = "http://192.168.111.115:8000";
let currentIndex = 10;
const API_GRAY = "/api/v1/series/";
const API_COLOR = "/api/v1/series/ssr/";

const core = new Core({ fps: 10 });
const resource = new Resource();
const viewportManager = new ViewportManager();
viewportManager.core = core;

const standard = viewportManager.addViewport({
  plane: "standard",
  renderer: "canvas",
  el: document.querySelector("#root"),
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

  resource.loadSeries(seriesId, "standard");
  setTimeout(() => {
    const data = resource.getImages(seriesId, "standard");
    const volume = new Volume();
    console.time("cost");
    volume.pretreatmentData(data);
    window.__VV__ = volume;
    console.timeEnd("cost");
  }, 5000);
});

document.addEventListener("wheel", async (e) => {
  let offset = Math.sign(e.wheelDelta);
  currentIndex += offset;
  const image = await resource.getImage(seriesId, currentIndex, "standard");
  standard.showImage(image);
});
