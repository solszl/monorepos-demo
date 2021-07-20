import Core from "@saga/core";
const core = new Core({ fps: 10 });
core.stage.fps = 5;
core.stage.on("internal_enter_frame", () => {
  console.log("renderer", Date.now());
});
