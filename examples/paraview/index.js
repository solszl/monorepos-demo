import { ParaViewClient, Resource, ViewportManager } from "@pkg/entry/src";
console.log("hello");

let tags = null;

let vrEl = document.querySelector(".vr");
let vmipEl = document.querySelector(".vmip");
let cprEl = document.querySelector(".cpr");
let axialEl = document.querySelector(".axial");
let sagittalEl = document.querySelector(".sagittal");
let coronalEl = document.querySelector(".coronal");
let planeEls = document.querySelectorAll(".plane");
let horizonEl = document.querySelector(".horizon");
let portraitEl = document.querySelector(".portrait");

const SERIES_ID = "1.3.12.2.1107.5.1.4.74356.30000019031800002060400067195";
const STUDY_ID = "1.2.840.20210326.121032504593";

const vm = new ViewportManager();
vm.resource = new Resource();

const HOST = "10.0.70.3";
const HTTP_PORT = "19570";
let WS_PORT = "-1";

const HTTP_API = {
  create: "create",
  ports: "/coronary/ports",
  destroy: "coronary/destroy/",
  destroyall: "coronary/destroyall",
};
const fetchWSPort = async () => {
  const url = `http://${HOST}:${HTTP_PORT}/${HTTP_API.create}`;

  const data = await (
    await fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        series_iuid: "1.2.392.200036.9116.2.2059767860.1617866629.8.1307500001.2",
        predict_type: "ct_heart",
        vr: {},
        mip: {},
        vr_tree: {},
      }),
    })
  ).json();
  console.log(data);
  WS_PORT = data.port;
};

const sleep = async (ms) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

const getMinMaxValues = (pixelData) => {
  let min = Number.MAX_SAFE_INTEGER;
  let max = Number.MIN_SAFE_INTEGER;
  const len = pixelData.length;
  let i = 0;
  let pixel;
  while (i < len) {
    pixel = pixelData[i];
    min = Math.min(min, pixel);
    max = Math.max(max, pixel);
    i += 1;
  }

  return { minPixelValue: min, maxPixelValue: max };
};

const main = async () => {
  await fetchWSPort();
  const resource = vm.resource;
  await resource.initTransfer([{ mode: "socket", host: HOST, port: WS_PORT, route: "vr" }]);
  // const axialViewport = vm.addViewport({
  //   plane: "pixel",
  //   renderer: "canvas",
  //   el: axialEl,
  //   transferMode: "socket",
  //   alias: "axial",
  // });

  // const { transferMode, alias: alias0 } = axialViewport.option;
  // let transfer = resource.getTransfer(transferMode);
  // const img0 = await transfer.getImage(SERIES_ID, 100, alias0);
  // axialViewport.imageView.showImage(img0);

  // const coronalViewport = vm.addViewport({
  //   plane: "pixel",
  //   renderer: "canvas",
  //   el: coronalEl,
  //   transferMode: "socket",
  //   alias: "coronary",
  // });

  // const { alias: alias1 } = coronalViewport.option;
  // transfer = resource.getTransfer(transferMode);
  // const img1 = await transfer.getImage(SERIES_ID, 100, alias1);
  // coronalViewport.imageView.showImage(img1);

  // const sagittalViewport = vm.addViewport({
  //   plane: "pixel",
  //   renderer: "canvas",
  //   el: sagittalEl,
  //   transferMode: "socket",
  //   alias: "sagittal",
  // });

  // const { alias: alias2 } = sagittalViewport.option;
  // transfer = resource.getTransfer(transferMode);
  // const img2 = await transfer.getImage(SERIES_ID, 100, alias2);
  // sagittalViewport.imageView.showImage(img2);

  const connection = resource.getTransfer("socket")?.connection;
  const viewport = new ParaViewClient({
    connection,
    el: vrEl,
  });

  // axialViewport.useTool(TOOL_TYPE.WWWC);
  // axialViewport.useTool(TOOL_TYPE.TRANSLATE, 2);
  // axialViewport.useTool(TOOL_TYPE.SCALE, 3);
  // axialViewport.useTool(TOOL_TYPE.STACK_WHEEL_SCROLL, 4);
  // sagittalViewport.useTool(TOOL_TYPE.WWWC);
  // sagittalViewport.useTool(TOOL_TYPE.TRANSLATE, 2);
  // sagittalViewport.useTool(TOOL_TYPE.SCALE, 3);
  // sagittalViewport.useTool(TOOL_TYPE.STACK_WHEEL_SCROLL, 4);
  // coronalViewport.useTool(TOOL_TYPE.WWWC);
  // coronalViewport.useTool(TOOL_TYPE.TRANSLATE, 2);
  // coronalViewport.useTool(TOOL_TYPE.SCALE, 3);
  // coronalViewport.useTool(TOOL_TYPE.STACK_WHEEL_SCROLL, 4);
};

main();
