import { Resource, ViewportManager } from "@pkg/entry/src";
import Frenet from "../../packages/viewer/src/algo/cpr/frenet";
import StretchedSampler from "../../packages/viewer/src/algo/cpr/samplers/stretched-sampler";
import ToolBar from "../toolbar/toolBar";
import { fetchDicom, fetchTreeLines } from "./fetchData";
const seriesId = "1.2.840.113704.7.32.07.5.1.4.76346.30000021052709540188000503559";

let currentIndex = 0;

let stretchedSampler;

let viewport1, viewport2, viewport3, viewport4;

const vm = new ViewportManager();
const resource = new Resource();
vm.resource = resource;
const toolbar = new ToolBar({ root: "toolBar" });

const prepare = async () => {
  // 初始化加载器、加载图像、加载中线
  await resource.initTransfer([{ mode: "web" }]);
  const transfer = resource.getTransfer("web");
  const imageUrls = await fetchDicom(seriesId);
  const treeLines = await fetchTreeLines(seriesId);

  // buildToolbar
  const { typeShow, lines } = treeLines;
  Object.keys(typeShow).forEach((key) => {
    toolbar.addBtn({
      name: key,
      fun: () => {
        // find center line
        const centerLinePhysics = typeShow[key].reduce((prev, current) => {
          return prev.concat(lines[current]);
        }, []);

        initialSamples(centerLinePhysics);
      },
    });
  });

  toolbar.addBtn({
    name: "启动测试",
    fun: () => {
      startTest();
    },
  });
  toolbar.addBtn({
    name: "停止测试",
    fun: () => {
      stopTest();
    },
  });

  transfer.addItemUrls(seriesId, imageUrls, "axial");
  transfer.loadSeries(seriesId, "axial");
};

const main = async () => {
  viewport1 = vm.addViewport({
    plane: "standard",
    renderer: "canvas",
    el: document.querySelector("#id1"),
    alias: "stretched",
    transferMode: "web",
  });
  viewport2 = vm.addViewport({
    plane: "standard",
    renderer: "canvas",
    el: document.querySelector("#id2"),
    alias: "stretched",
    transferMode: "web",
  });
  viewport3 = vm.addViewport({
    plane: "standard",
    renderer: "canvas",
    el: document.querySelector("#id3"),
    alias: "stretched",
    transferMode: "web",
  });
  viewport4 = vm.addViewport({
    plane: "standard",
    renderer: "canvas",
    el: document.querySelector("#id4"),
    alias: "stretched",
    transferMode: "web",
  });
};

const initialSamples = (points) => {
  const transfer = resource.getTransfer("web");
  const images = transfer.getImages(seriesId, "axial");
  let frenet = new Frenet().calcFrenet(points, 1);
  stretchedSampler = new StretchedSampler();
  stretchedSampler.images = images;
  stretchedSampler.frenet = frenet;
  stretchedSampler.ratio = 1;
  window.s = stretchedSampler;
  sampleImage(0, 0);
};

const sampleImage = (theta, phi = 0) => {
  stretchedSampler.theta = theta;
  stretchedSampler.phi = phi;
  stretchedSampler.prepareForGenerate();
  stretchedSampler.generate();

  const img = stretchedSampler.samplerImage;
  viewport1.imageView.showImage(img);
  // viewport2.imageView.showImage(img);
  // viewport3.imageView.showImage(img);
  // viewport4.imageView.showImage(img);
};

let testInterval = 0;
const startTest = () => {
  let theta = 0;
  testInterval = setInterval(() => {
    sampleImage(theta++);
  }, 2000);
};

const stopTest = () => {
  clearInterval(testInterval);
};

prepare();
main();
