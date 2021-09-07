import { ViewportManager } from "@saga/entry";
import { Resource } from "@saga/loader";
const VIDEO_URL = "https://www.runoob.com/try/demo_source/mov_bbb.mp4";
const vm = new ViewportManager();
const resource = new Resource();
vm.resource = resource;
const viewport = vm.addViewport({
  plane: "video",
  el: document.querySelector("#root"),
});

viewport.imageView.showVideo(VIDEO_URL);

// 测试截图
setTimeout(async () => {
  const canvas = await viewport.imageView.snapshot();
  document.body.appendChild(canvas);
}, 3000);
