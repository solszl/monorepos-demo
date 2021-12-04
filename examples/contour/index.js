import { TOOL_TYPE, ViewportEvents, ViewportManager } from "@pkg/entry/src";
import { Resource } from "@pkg/loader/src";
import ContourColourConfig from "../../packages/tools/src/tools/segmention/contour/contour-colour-config";
import ContourItem from "../../packages/tools/src/tools/segmention/contour/contour-item";
import ContourManager from "../../packages/tools/src/tools/segmention/contour/contour-manager";
import ContourEditor from "../../packages/tools/src/tools/segmention/editor";
import { slim } from "../../packages/tools/src/tools/segmention/utils/slim";
import { config as colorConfig } from "./contour-config";
import contourData from "./data.json";
import imageUrls from "./img";
const seriesId = "1.2.392.200036.9116.2.1796265700.1617665962.13.2282000001.2";
let currentIndex = 133;

const vm = new ViewportManager();
vm.resource = new Resource();

const cm = new ContourManager();

const standard = vm.addViewport({
  plane: "standard",
  renderer: "canvas",
  alias: "axial",
  transferMode: "web",
  el: document.querySelector("#root"),
});

const editor = new ContourEditor(standard);
const colourConfig = new ContourColourConfig(colorConfig);

const convertToSagaToolDataStruct = (contour) => {
  let data = {};
  const id = Math.random().toString(36).substring(2);
  data.id = id;
  data.data = {
    id,
    type: "polygon",
    points: contour.data,
    position: { x: 0, y: 0 },
    useCustomColourConfig: !!contour.colour,
    colour: contour.colour,
  };

  return data;
};

const main = async () => {
  const resource = vm.resource;
  await resource.initTransfer([{ mode: "web" }]);
  const { transferMode, alias } = standard.option;
  const transfer = resource.getTransfer(transferMode);
  transfer.addItemUrls(seriesId, imageUrls, alias);
  standard.useTool(TOOL_TYPE.STACK_WHEEL_SCROLL, 4);

  setTimeout(async () => {
    // const image = await transfer.getImage(seriesId, currentIndex, alias);
    // standard.imageView.showImage(image);
    standard.showImage(seriesId, currentIndex);
  }, 0);

  console.log(contourData);
  const {
    data: { lesions },
  } = contourData;
  console.log(lesions);

  // 3~~8ms   loop
  Object.keys(lesions).forEach((key) => {
    lesions[key]["contour"]["data"].map((item) => {
      const contourItem = new ContourItem();
      contourItem.data = item.contour;
      contourItem.sliceId = item.sliceId;
      contourItem.key = key;
      contourItem.colour = colourConfig.get(key);
      contourItem.calcBoundRect();

      cm.addContour(contourItem);
    });
  });
  console.log(cm);

  // convert to saga tool data struct.
  cm.getAllSlices().map((pageIndex) => {
    const contours = cm.getContoursBySlice(pageIndex);
    const sliceKey = `${seriesId}-${pageIndex}`;
    const sliceData = standard.data?.[sliceKey] ?? new Map();

    contours.map((contour) => {
      const data = convertToSagaToolDataStruct(contour);
      sliceData.set(data.id, data.data);
    });

    standard.data[sliceKey] = sliceData;
  });
};

standard.on(ViewportEvents.SLICE_CHANGED, (info) => {
  const { currentIndex } = info;
  const contours = cm.getContoursBySlice(currentIndex);
  // console.log(currentIndex, contours);
});

document.querySelector("#btnLM").addEventListener("click", (e) => {
  mergeContours("LM");
});
document.querySelector("#btnLAD").addEventListener("click", (e) => {
  mergeContours("LAD");
});
document.querySelector("#btnLCX").addEventListener("click", (e) => {
  mergeContours("LCX");
});
document.querySelector("#btnRCA").addEventListener("click", (e) => {
  mergeContours("RCA");
});

document.querySelector("#btnStart").addEventListener("click", (e) => {
  editor.start();
});
document.querySelector("#btnEnd").addEventListener("click", (e) => {
  editor.stop();
});

const mergeContours = (contourKey) => {
  document.querySelector("#temp").innerHTML = "";
  const result = [];
  const foundContours = editor.shadowCanvas.findContour() ?? [];

  const slimedContours = slim(foundContours);
  // 跟目标key进行合并。 对其他key进行擦除
  // TODO: union rectangle
  const shouldUnionContour = cm.getSpecifiedContour(currentIndex, contourKey).map((c) => c.data);
  // TODO: subtract rectangle
  const shouldSubtractContours = cm.getContoursBySlice(currentIndex).filter((contour) => contour.key !== contourKey);

  const unionData = {
    key: contourKey,
    data: editor.unionContours(shouldUnionContour, slimedContours, { width: 512, height: 512 }),
  };
  result.push(unionData);

  shouldSubtractContours.map((contour) => {
    const { key, data, boundRect } = contour;
    console.log("key", contour);
    const subtractData = {
      key,
      data: editor.subtractContours(data, slimedContours, { width: 512, height: 512, boundRect }),
    };

    result.push(subtractData);
  });

  console.log(result);
  // console.log(slimedContours, shouldUnionContour, shouldSubtractContour);

  // const drawContours = editor.shadowCanvas.findContour().map((contour) => {
  //   return makeContour(contour, contourKey, currentIndex);
  // });
  // const contours = cm.getSpecifiedContour(currentIndex, contourKey);

  // const sourceData = [...drawContours, ...contours];

  // const sliceKey = `${seriesId}-${currentIndex}`;
  // const sliceData = standard.data?.[sliceKey] ?? new Map();
  // sliceData.clear();
  // sourceData.map((contour) => {
  //   const data = convertToSagaToolDataStruct(contour);
  //   sliceData.set(data.id, data.data);
  // });

  // console.log(drawContours, contours, sourceData);
  // standard.data[sliceKey] = sliceData;
};

const makeContour = (contour, contourKey, currentIndex) => {
  let item = new ContourItem();
  item.key = contourKey;
  item.data = contour;
  item.sliceId = currentIndex;
  item.colour = colourConfig.get(contourKey);
  item.calcBoundRect();

  return item;
};
window.a = standard; // viewer
window.cm = cm; // contour manager
window.editor = editor;

main();
