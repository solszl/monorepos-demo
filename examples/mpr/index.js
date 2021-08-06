import { Core } from "@saga/core";
import { Resource } from "@saga/loader";
import { Volume, Plane, ObliqueSampler, ViewportManager } from "@saga/viewer";
import { vec3 } from "gl-matrix";
const seriesId = "1.2.410.200010.1160924.3152.150159.175159.1169700.175159";
const fs = "http://192.168.109.92:8000";
let currentIndex = 0;
const API = "/ct_chest/api/combine/";

const core = new Core({ fps: 10 });
const resource = new Resource();
const viewportManager = new ViewportManager();
viewportManager.core = core;

let plane;
/** @type {ObliqueSampler} */
let sampler;
let center, vector;

// let plane1 = new Plane();
// plane1.makeFrom3Points([2, -1, 4], [-1, 3, -2], [0, 2, 3]);
// console.log("111", plane1);
// let plane2 = new Plane();
// plane2.makeFrom1Point1Vector([2, -3, 0], [1, -2, 3]);
// console.log("222", plane2);

const standard = viewportManager.addViewport({
  plane: "standard",
  renderer: "canvas",
  el: document.querySelector("#axis"),
});

const fetchData = async (seriesId) => {
  const url = `${API}${seriesId}`;
  const json = await (await fetch(url)).json();
  return json;
};

fetchData(seriesId).then((json) => {
  // const imageUrls = json.series.images.map((i) => {
  //   return `${fs}/${i.storagePath}`;
  // });

  const imageUrls = Array.from(
    new Array(303),
    (_, i) => `http://localhost:8887/IMG${(i + 1).toString().padStart(4, 0)}.dcm`
  );

  resource.addItemUrls(seriesId, imageUrls, "standard");

  setTimeout(async () => {
    const image = await resource.getImage(seriesId, currentIndex, "standard");
    standard.showImage(image);
  }, 0);

  resource.loadSeries(seriesId, "standard");

  setTimeout(async () => {
    const data = resource.getImages(seriesId, "standard");
    const volume = new Volume();
    console.time("cost");
    volume.pretreatmentData(data);
    window.__VV__ = volume;
    console.timeEnd("cost");

    // center = volume.dimensionInfo.center;
    const [x, y, z] = volume.dimensionInfo.sizeInPx;
    center = [192.99999999999997, 151.49999999999997, 235.18781747091268];
    vector = [0, 0, 1]; // [1,0,0],[0,1,0],[0,0,1]
    plane = new Plane();
    plane.makeFrom1Point1Vector(center, vector);
    console.log(plane);

    sampler = new ObliqueSampler(volume, plane);
    sampler.update();
    sampler.startSampling();

    let tmpImage = await resource.getImage(seriesId, currentIndex, "standard");
    tmpImage.pixelData = sampler.image.data;
    tmpImage.rows = sampler.image.height;
    tmpImage.columns = sampler.image.width;
    standard.showImage(tmpImage);
  }, 15000);
});

document.addEventListener("wheel", async (e) => {
  let offset = Math.sign(e.wheelDelta);
  currentIndex += offset;

  plane.makeFrom1Point1Vector(vec3[offset > 0 ? "add" : "sub"](center, center, vector), vector);
  sampler.plane = plane;
  sampler.update();
  sampler.startSampling();
  let tmpImage = await resource.getImage(seriesId, currentIndex, "standard");
  tmpImage.pixelData = sampler.image.data;
  tmpImage.rows = sampler.image.height;
  tmpImage.columns = sampler.image.width;
  standard.showImage(tmpImage);

  resource.cacheItem(seriesId, { key: currentIndex, value: tmpImage }, "sagittal");

  console.log("currentIndex", currentIndex);

  // let offset = Math.sign(e.wheelDelta);
  // currentIndex += offset;
  // const image = await resource.getImage(seriesId, currentIndex, "standard");
  // standard.showImage(image);
});
