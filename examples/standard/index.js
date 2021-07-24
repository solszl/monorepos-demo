import { Core } from "@saga/core";
import ViewportManager from "@saga/viewer";
let core = new Core({ fps: 15 });

const viewportManager = new ViewportManager();
viewportManager.core = core;

viewportManager.addViewport({
  plane: "standard",
  renderer: "webgl",
  el: document.querySelector("#root"),
});
