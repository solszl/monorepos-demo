import CanvasRenderer from "./render/canvas";
import WebglRenderer from "./render/webgl";
import { webglSupported } from "./render/webgl/utils";
import { StandardViewport } from "./viewports";
import PixelViewport from "./viewports/pixel";
import VideoViewport from "./viewports/video";

export const factory = (option) => {
  let viewport = null; // 视窗
  // 使用canvas 还是 webgl 去渲染。
  let renderer =
    option.renderer === "webgl"
      ? webglSupported()
        ? new WebglRenderer()
        : new CanvasRenderer()
      : new CanvasRenderer();

  switch (option.plane) {
    case "standard":
      viewport = StandardViewport.create(option);
      break;
    case "pixel":
      viewport = PixelViewport.create(option);
      break;
    case "video":
      viewport = VideoViewport.create(option);
      break;
  }

  viewport.core = option.core;
  viewport.renderer = renderer; // 设置渲染器
  return viewport;
};
