import AbstractViewport from "./abstract-viewport";

class VideoViewport extends AbstractViewport {
  constructor(option = {}) {
    super(option);
  }

  init() {
    this.initContainer();
    this.initVideo();
  }

  initVideo() {
    const video = document.createElement("video");
    video.style.position = "absolute";
    video.style.display = "block";
    let { width, height } = this._getRootSize();
    video.width = width;
    video.height = height;
    this.video = video;
    this.video.className = "__tx-dicom";
    this.video.controls = true;
    this.video.id = this.id;
    this.viewerContainer.insertBefore(this.video, this.viewerContainer.firstChild);
    this.viewerContainer.style.zIndex = 10;
  }

  showVideo(src) {
    this.video.src = src;
  }

  resize(width, height) {
    super.resize(width, height);
    this.video.width = width;
    this.video.height = height;
  }

  async snapshot() {
    const canvas = document.createElement("canvas");
    canvas.width = this.video.videoWidth;
    canvas.height = this.video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(this.video, 0, 0);
    return canvas;
  }
  static create(option) {
    return new VideoViewport(option);
  }
}

export default VideoViewport;
