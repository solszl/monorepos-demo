import { ViewportManager } from "@pkg/entry/src";
import { Resource } from "@pkg/loader/src";

const SERIES_ID = "1.2.840.113619.2.437.3.2831215364.545.1555459452.845";
const fs = "http://172.16.3.35:8000";
let currentIndex = 20;
const API_GRAY = "/api/v1/series/";
const API_COLOR = "/api/v1/series/ssr/";

const vm = new ViewportManager();
vm.resource = new Resource();

const standard = vm.addViewport({
  plane: "vr_standard",
  renderer: "canvas",
  alias: "vr",
  transferMode: "web",
  el: document.querySelector("#root"),
  cubeEl: document.querySelector("#cube"),
});

standard.imageView.setUrlObjs([
  {
    url: "http://172.16.6.9:8000/RESULT/2/heart.vtp.gz",
    type: "heart",
    multiLabel: false,
    color: "#ff0000",
    groupName: "heart",
    centerGroup: true,
  },
  {
    url: "http://172.16.6.9:8000/RESULT/2/coronary.vtp.gz",
    type: "coronary",
    multiLabel: true,
    // color: "#00ff00",
    groupName: "coronary",
  },
]);

window.viewport = standard;
