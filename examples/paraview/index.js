import { MOUSE_BUTTON, Resource, TOOL_TYPE, ViewportEvents, ViewportManager } from "@pkg/entry/src";

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

const PATIENT_ID = "CE027001-118040304613";
const STUDY_ID = "1.2.840.20180404.118040304613";
const SERIES_ID = "1.2.392.200036.9116.2.6.1.3268.2059767860.1522820353.891250";
const PREDICT_TYPE = "ct_cerebral";

/** @type { ViewportManager } */
const vm = new ViewportManager();
vm.resource = new Resource();

const HOST = "172.16.3.35";
const WS_HOST = "ws://172.16.3.35:8000";
const HTTP_PORT = "8000";
let WS_PORT = "-1";

const useProxy = true;

const HTTP_API = {
  create: useProxy ? "api/wsApi/create" : "create",
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
        patient_id: PATIENT_ID,
        study_iuid: STUDY_ID,
        series_iuid: SERIES_ID,
        predict_type: PREDICT_TYPE,
        render: { add_text: false, default: "neckBloodVesselInverseVMIP" },
        mip: {},
        cpr: {},
        // vr: { add_text: true },
        // mip: { add_text: true },
        // vr_tree: { add_text: true },
      }),
    })
  ).json();
  console.log(data);
  WS_PORT = data.port;
};

const main = async () => {
  await fetchWSPort();
  const resource = vm.resource;
  await resource.initTransfer([
    {
      mode: "socket",
      host: WS_HOST,
      routes: [
        // `vtkserver/${SERIES_ID}/vr`,
        // `vtkserver/${SERIES_ID}/cpr`,
        // `vtkserver/${SERIES_ID}/mip`,
        // `vtkserver/${SERIES_ID}/render`,
        `volumerender/${WS_PORT}/${SERIES_ID}/cpr`,
        `volumerender/${WS_PORT}/${SERIES_ID}/mip`,
        `volumerender/${WS_PORT}/${SERIES_ID}/render`,
      ],
    },
  ]);

  // const conn = resource.getTransfer("socket").getConnection(`vtkserver/${SERIES_ID}/vr`);
  // console.log(conn);

  const vrViewport = vm.addViewport({
    plane: "remote_stream",
    renderer: "canvas",
    el: vrEl,
    transferMode: "socket",
    alias: "render",
    route: "render",
  });
  await vrViewport.imageView.initialAsyncWorkflow();
  window.viewport = vrViewport;

  const axialViewport = vm.addViewport({
    plane: "remote_mip",
    renderer: "canvas",
    el: axialEl,
    transferMode: "socket",
    alias: "axial",
    route: "mip",
    httpServer: "http://172.16.3.35:8000",
  });

  await axialViewport.imageView.initialAsyncWorkflow();
  window.mipViewport = axialViewport;
  axialViewport.imageView.getImage(100, "axial", 10, true);
  axialViewport.useTool(TOOL_TYPE.STACK_SCROLL);
  axialViewport.useTool(TOOL_TYPE.STACK_WHEEL_SCROLL, MOUSE_BUTTON.WHEEL);

  const lumenViewport = vm.addViewport({
    plane: "remote_lumen",
    renderer: "canvas",
    el: portraitEl,
    transferMode: "socket",
    alias: "cpr",
    route: "cpr",
    direction: "portrait",
    httpServer: "http://172.16.3.35:8000",
    vesselName: "vessel11",
  });
  await lumenViewport.imageView.initialAsyncWorkflow();
  lumenViewport.imageView.setVesselName("vessel11");
  lumenViewport.imageView.setAngle(35);
  lumenViewport.useTool(TOOL_TYPE.STACK_SCROLL, MOUSE_BUTTON.LEFT);
  lumenViewport.useTool(TOOL_TYPE.STACK_WHEEL_SCROLL, MOUSE_BUTTON.WHEEL);
  lumenViewport.on(ViewportEvents.VERNIER_INDEX_CHANGED, (e) => {
    cprViewport.imageView.setVernierIndex(e.index);
  });

  lumenViewport.imageView.setVesselObjKeymap({
    vessel1: "L-ICA",
    vessel10: "L-ACA",
    vessel11: "R-ACA",
    vessel12: "L-MCA",
    vessel13: "R-MCA",
    vessel14: "R-PCA",
    vessel15: "L-PCA",
    vessel2: "R-ICA",
    vessel23: "R-VA",
    vessel24: "AOAR",
    vessel3: "L-CCA",
    vessel4: "R-CCA",
    vessel7: "L-SA",
    vessel8: "R-SA",
    vessel9: "INA",
  });
  window.lumenViewport = lumenViewport;

  const cprViewport = vm.addViewport({
    plane: "remote_cpr",
    renderer: "canvas",
    el: cprEl,
    transferMode: "socket",
    alias: "cpr",
    route: "cpr",
    httpServer: "http://172.16.3.35:8000",
    vesselName: "vessel11",
  });
  await cprViewport.imageView.initialAsyncWorkflow();
  // for verify render schedule validate function.
  cprViewport.imageView.setVesselName("vessel11");
  cprViewport.imageView.setTheta(35);
  // 这里使用滚轮工具， 调整角度
  cprViewport.useTool(TOOL_TYPE.STACK_SCROLL);
  cprViewport.useTool(TOOL_TYPE.STACK_WHEEL_SCROLL, MOUSE_BUTTON.WHEEL);
  window.cprViewport = cprViewport;

  let index = (Math.random() * 100) >> 0;
  for await (const el of planeEls) {
    const probeViewport = vm.addViewport({
      plane: "remote_probe",
      renderer: "canvas",
      el,
      transferMode: "socket",
      alias: "probe",
      route: "cpr",
      httpServer: "http://172.16.3.35:8000",
    });

    await probeViewport.imageView.initialAsyncWorkflow();
    probeViewport.imageView.setVesselName("vessel11");
    probeViewport.imageView.setIndex(index++);
  }

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

  // const connection = resource.getTransfer("socket")?.connection;
  // const viewport = new ParaViewClient({
  //   connection,
  //   el: vrEl,
  // });

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
