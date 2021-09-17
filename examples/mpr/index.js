import { Resource, ViewportManager } from "@pkg/entry/src";
import { ObliqueSampler, Plane, Volume } from "@pkg/viewer/src";
import { vec3 } from "gl-matrix";
const seriesId = "1.2.840.113619.2.404.3.1074448704.467.1622952070.403";
const fs = "http://192.168.111.115:8000";
let currentIndex = 0;
const API = "/api/v1/series/";

const vm = new ViewportManager();
vm.resource = new Resource();

let plane;
/** @type {ObliqueSampler} */
let sampler;
let center, vector;

const standard = vm.addViewport({
  plane: "standard",
  renderer: "canvas",
  alias: "axial",
  transferMode: "web",
  el: document.querySelector("#axis"),
});

const fetchData = async (seriesId) => {
  const url = `${API}${seriesId}`;
  const json = await (await fetch(url)).json();
  return json;
};

fetchData(seriesId).then(async (json) => {
  const imageUrls = json.data.images.map((i) => {
    return `${fs}/${i.storagePath}`;
  });

  const resource = vm.resource;
  await resource.initTransfer([{ mode: "web" }]);
  console.log(standard.option);
  const { transferMode, alias } = standard.option;
  const transfer = resource.getTransfer(transferMode);
  transfer.addItemUrls(seriesId, imageUrls, alias);

  setTimeout(async () => {
    const image = await transfer.getImage(seriesId, currentIndex, alias);
    standard.imageView.showImage(image);
  }, 0);

  transfer.loadSeries(seriesId, alias);

  setTimeout(async () => {
    const data = transfer.getImages(seriesId, alias);
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

    let tmpImage = await transfer.getImage(seriesId, currentIndex, alias);
    tmpImage.pixelData = sampler.image.data;
    tmpImage.rows = sampler.image.height;
    tmpImage.columns = sampler.image.width;
    standard.imageView.showImage(tmpImage);
  }, 7000);
});

document.addEventListener("wheel", async (e) => {
  let offset = Math.sign(e.wheelDelta);
  currentIndex += offset;

  plane.makeFrom1Point1Vector(
    vec3[offset > 0 ? "add" : "sub"](center, center, vector),
    vector
  );
  sampler.plane = plane;

  console.log(center, vector);
  sampler.update();
  sampler.startSampling();

  const resource = vm.resource;
  const { transferMode, alias } = standard.option;
  const transfer = resource.getTransfer(transferMode);
  let tmpImage = await transfer.getImage(seriesId, currentIndex, alias);
  tmpImage.pixelData = sampler.image.data;
  tmpImage.rows = sampler.image.height;
  tmpImage.columns = sampler.image.width;
  standard.imageView.showImage(tmpImage);

  transfer.cacheItem(seriesId, { key: currentIndex, value: tmpImage }, alias);

  console.log("currentIndex", currentIndex);

  // let offset = Math.sign(e.wheelDelta);
  // currentIndex += offset;
  // const image = await resource.getImage(seriesId, currentIndex, "standard");
  // standard.showImage(image);
});
