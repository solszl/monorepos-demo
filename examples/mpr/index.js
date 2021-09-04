import { Core } from "@saga/core";
import { Resource } from "@saga/loader";
import { Volume, Plane, ObliqueSampler, factory as ViewFactory } from "@saga/viewer";
import { vec3 } from "gl-matrix";
const seriesId = "1.2.840.113619.2.404.3.1074448704.467.1622952070.403";
const fs = "http://192.168.111.115:8000";
let currentIndex = 0;
const API = "/api/v1/series/";

const core = new Core({ fps: 10 });
const resource = new Resource();

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

const standard = ViewFactory({
  plane: "standard",
  renderer: "canvas",
  el: document.querySelector("#axis"),
  core,
});

const fetchData = async (seriesId) => {
  const url = `${API}${seriesId}`;
  const json = await (await fetch(url)).json();
  return json;
};

fetchData(seriesId).then((json) => {
  const imageUrls = json.data.images.map((i) => {
    return `${fs}/${i.storagePath}`;
  });

  // const imageUrls = Array.from(
  //   new Array(303),
  //   (_, i) => `http://localhost:8887/IMG${(i + 1).toString().padStart(4, 0)}.dcm`
  // );

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
    center = [190, 150, 152];
    vector = [0, 1, 0]; // [1,0,0],[0,1,0],[0,0,1]
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
  }, 7000);
});

document.addEventListener("wheel", async (e) => {
  let offset = Math.sign(e.wheelDelta);
  currentIndex += offset;

  plane.makeFrom1Point1Vector(vec3[offset > 0 ? "add" : "sub"](center, center, vector), vector);
  sampler.plane = plane;

  console.log(center, vector);
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
