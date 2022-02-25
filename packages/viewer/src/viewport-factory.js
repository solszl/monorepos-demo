import {
  RemoteCPRViewport,
  RemoteLumenViewport,
  RemoteMIPViewport,
  RemoteProbeViewport,
  RemoteVRViewport,
} from "@pkg/remote/src";
import CanvasRenderer from "./render/canvas";
import WebglRenderer from "./render/webgl";
import { webglSupported } from "./render/webgl/utils";
import { PixelViewport, StandardViewport, VideoViewport } from "./viewports";

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
    case "remote_stream":
      viewport = RemoteVRViewport.create(option);
      break;
    case "remote_mip":
      viewport = RemoteMIPViewport.create(option);
      break;
    case "remote_cpr":
      viewport = RemoteCPRViewport.create(option);
      break;
    case "remote_lumen":
      viewport = RemoteLumenViewport.create(option);
      break;
    case "remote_probe":
      viewport = RemoteProbeViewport.create(option);
      break;
  }

  viewport.core = option.core;
  viewport.renderer = renderer; // 设置渲染器
  return viewport;
};
