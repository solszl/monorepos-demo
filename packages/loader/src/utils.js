let canvas = document.createElement("canvas");
// 因为worker无法操作dom，当加载jpg,png的时候，将arrayBuffer 返回，构建影像
export const postprocessor = async (image, task) => {
  return new Promise((resolve, reject) => {
    let img = image;
    const { format, seriesId, index } = task;
    if (format === "webimage") {
      img = {};
      let tempImg = new Image();
      var arrayBufferView = new Uint8Array(image.data);
      var blob = new Blob([arrayBufferView], { type: "image/jpeg" });
      const urlCreator = window.URL || window.webkitURL;
      const imageUrl = urlCreator.createObjectURL(blob);
      tempImg.src = imageUrl;
      tempImg.onload = (evt) => {
        img.columns = tempImg.width;
        img.rows = tempImg.height;
        img.color = "rgb";
        img.samplesPerPixel = 4;
        img.windowWidth = 255;
        img.windowCenter = 128;
        img.maxPixelValue = 255;
        img.minPixelValue = 0;
        img.intercept = 0;
        img.slope = 1;
        img.seriesId = seriesId;
        img.instanceNumber = index;
        img.imageType = "webImage";

        canvas.width = tempImg.width;
        canvas.height = tempImg.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(tempImg, 0, 0);
        img.pixelData = ctx.getImageData(0, 0, tempImg.width, tempImg.height).data;
        resolve(img);
      };
    } else {
      resolve(img);
    }
  });
};
