import RemoteRenderer from "paraviewweb/src/NativeUI/Canvas/RemoteRenderer";
import ParaViewWebClient from "paraviewweb/src/IO/WebSocket/ParaViewWebClient";
import SizeHelper from "paraviewweb/src/Common/Misc/SizeHelper";
import SmartConnect from "wslink/src/SmartConnect";
import { ViewportManager } from "@saga/entry";
import { createImage } from "@saga/remote";
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

const vm = new ViewportManager();
const axialViewport = vm.addViewport({
  plane: "pixel",
  renderer: "canvas",
  el: axialEl,
});

const coronalViewport = vm.addViewport({
  plane: "pixel",
  renderer: "canvas",
  el: coronalEl,
});

const sagittalViewport = vm.addViewport({
  plane: "pixel",
  renderer: "canvas",
  el: sagittalEl,
});

const HOST = "192.168.110.75";
const HTTP_PORT = "19570";
let WS_PORT = "-1";

const HTTP_API = {
  create: "coronary/create",
  ports: "/coronary/ports",
  destroy: "coronary/destroy/",
  destroyall: "coronary/destroyall",
};
const dropPort = async (port) => {
  const url = `http://${HOST}:${HTTP_PORT}/${HTTP_API.destroy}${port}`;
  const req = new Request(url, {
    method: "DELETE",
    mode: "cors",
  });
  await fetch(req);
};

const getAllPorts = async () => {
  const url = `http://${HOST}:${HTTP_PORT}/${HTTP_API.ports}`;
  const req = new Request(url, {
    method: "get",
  });
  const data = await (await fetch(req)).json();
  console.log(data);
  return Object.values(data);
};
const fetchWSPort = async () => {
  const url = `http://${HOST}:${HTTP_PORT}/${HTTP_API.create}`;
  const req = new Request(url, {
    method: "get",
    data: JSON.stringify({
      series_iuid: "1.2.392.200036.9116.2.2059767860.1616749574.11.1233000004.2",
      study_iuid: "1.2.840.20210326.121032504593",
    }),
  });
  const data = await (await fetch(req)).json();
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

const connect = async (sc) => {
  return new Promise((resolve, reject) => {
    sc.onConnectionReady((callback) => {
      console.log("connected.");
      resolve(sc.getSession());
    });
    sc.onConnectionError((callback) => {
      console.log("connected error");
      reject();
    });
    sc.connect();
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
  const ports = await getAllPorts();
  for await (const item of ports) {
    await dropPort(item.port);
  }
  await sleep(100);
  await fetchWSPort();
  const config = {
    sessionURL: `ws://${HOST}:${WS_PORT}/ws`,
  };

  await sleep(1000);
  const sc = SmartConnect.newInstance({ config });
  const session = await connect(sc);

  tags = await session.call("coronary.tag");
  console.log(tags);

  const client = ParaViewWebClient.createClient(sc, [
    "MouseHandler",
    "ViewPort",
    "ViewPortImageDelivery",
  ]);

  const vrRenderer = new RemoteRenderer(client);
  vrRenderer.setContainer(vrEl);
  vrRenderer.onImageReady(() => {
    console.log("vr render completed.");
  });

  // SizeHelper.onSizeChange(() => {
  //   console.log("resize");
  // });
  // SizeHelper.startListening();

  const pixelData = await session.call("coronary.dicom.axial", [], {
    x: 200,
    y: 200,
    z: 120,
  });

  const axialImage = await createImage(
    pixelData.pixel,
    Object.assign(
      {},
      tags,
      { columns: pixelData.columns, rows: pixelData.rows },
      { spacing: [pixelData.spacingX, pixelData.spacingY, pixelData.spacingZ] },
      getMinMaxValues(pixelData.pixel)
    )
  );
  axialViewport.imageView.showImage(axialImage);

  const sagittalData = await session.call("coronary.dicom.sagittal", [], {
    x: 200,
    y: 200,
    z: 120,
  });

  const sagittalImage = await createImage(
    sagittalData.pixel,
    Object.assign(
      {},
      tags,
      { columns: sagittalData.columns, rows: sagittalData.rows },
      { spacing: [sagittalData.spacingX, sagittalData.spacingY, sagittalData.spacingZ] },
      getMinMaxValues(sagittalData.pixel)
    )
  );
  sagittalViewport.imageView.showImage(sagittalImage);

  const coronalData = await session.call("coronary.dicom.coronary", [], {
    x: 200,
    y: 200,
    z: 120,
  });

  const coronalImage = await createImage(
    coronalData.pixel,
    Object.assign(
      {},
      tags,
      { columns: coronalData.columns, rows: coronalData.rows },
      { spacing: [coronalData.spacingX, coronalData.spacingY, coronalData.spacingZ] },
      getMinMaxValues(coronalData.pixel)
    )
  );
  coronalViewport.imageView.showImage(coronalImage);
};

axialViewport.useTool("wwwc");
axialViewport.useTool("translate", 2);
axialViewport.useTool("scale", 3);
sagittalViewport.useTool("wwwc");
sagittalViewport.useTool("translate", 2);
sagittalViewport.useTool("scale", 3);
coronalViewport.useTool("wwwc");
coronalViewport.useTool("translate", 2);
coronalViewport.useTool("scale", 3);
main();
