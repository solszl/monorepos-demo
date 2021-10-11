import { Core } from "@pkg/core/src";
const core = new Core({ fps: 10 });
core.stage.fps = 5;
core.stage.on("internal_enter_frame", () => {
  console.log("renderer", Date.now());
});
