import { Core } from "@saga/core";
import ViewportManager from "../../packages/viewer/src";
import { Resource } from "@saga/loader";
const seriesId = "1.3.46.670589.33.1.63758074643606917200002.5725553829146337340";
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
});

document.addEventListener("wheel", async (e) => {
  let offset = Math.sign(e.wheelDelta);
  currentIndex += offset;
  const image = await resource.getImage(seriesId, currentIndex, "standard");
  standard.showImage(image);
});

// ====================== test begin=================
const delay = async (ms, value) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms, value);
  });
};

for (let i = 0; i < 10000; i++) {
  setTimeout(async () => {
    core.stage.startRender();
    await delay(50);
  }, Math.random() * 1000);
}

// ====================test end =====================
