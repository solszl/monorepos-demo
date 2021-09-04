import MipBuilder from "./mip-builder";
const DEFAULT_CONFIG = {
  planBufferSize: 5,
};

class Mip {
  constructor() {
    this._imageList = null;
    this.buffer = [];
    this.method = "max";
  }

  /**
   *
   *
   * @param { number } index
   * @param { number } step
   * @memberof Mip
   * @returns { DicomImage } image
   */
  async getImage(index, step) {
    let start = Math.max(0, Math.min(index, this.imageList.length));
    let end = Math.min(start + step - 1, this.imageList.length);
    let tempImage = this.imageList[start];
    const chunks = await this.getIntersectChunks(start, end);
    const getPixelData = (chunks) => {
      let temp = {};

      for (let chunk of chunks) {
        for (let [key, tree] of chunk.chunk.data) {
          let data = tree.getValue(chunk.sliceStart, chunk.sliceEnd);

          if (!temp[key]) {
            temp[key] = data;
          } else {
            temp[key] = tree.fn(temp[key], data);
          }
        }
      }
      let structureData = new Int16Array(tempImage.columns * tempImage.rows);
      let size = temp[0].length;
      let keys = Object.keys(temp);

      for (let key of keys) {
        structureData.set(temp[key], key * size);
      }
      temp = null;
      return structureData;
    };

    const getMinMaxValues = (pixelData) => {
      console.time("minmax");
      let min = Number.MAX_SAFE_INTEGER;
      let max = Number.MIN_SAFE_INTEGER;
      const len = pixelData.length;
      let i = 0;
      let pixel;
      while (i < len) {
        pixel = pixelData[i];
        min = Math.min(min, pixel);
        max = Math.max(max, pixel);
        i += 1;
      }
      console.timeEnd("minmax");

      return { minPixelValue: min, maxPixelValue: max };
    };

    const pixelData = getPixelData(chunks);
    tempImage.pixelData = pixelData;
    Object.assign(tempImage, getMinMaxValues(pixelData));
    return tempImage;
  }

  async getIntersectChunks(start, end) {
    let chunks = [];
    for (let chunk of this.buffer) {
      if (chunk.start > end || chunk.end < start) {
        continue;
      }

      const offset = chunk.index * chunk.bufferSize;
      chunks.push({
        sliceStart: Math.max(chunk.start, start) - offset,
        sliceEnd: Math.min(chunk.end, end) - offset,
        chunk,
      });
    }

    return chunks;
  }

  buildBuffer() {
    this.buffer = [];
    const { planBufferSize } = DEFAULT_CONFIG;
    const cloneImageList = [...this.imageList];
    const perBufferLength = Math.floor(cloneImageList.length / planBufferSize);
    const getBufferItem = (index) => {
      let item = {
        start: index * perBufferLength,
        end: index * perBufferLength + perBufferLength - 1,
        index,
        bufferSize: perBufferLength,
      };
      let data = cloneImageList.splice(0, perBufferLength);
      if (cloneImageList.length < perBufferLength) {
        data = data.concat(cloneImageList);
        item.end = this.imageList.length;
      }

      item.data = data;
      return item;
    };

    const createPixelMap = (item) => {
      const { data } = item; // sub image list;
      let pixelMap = new Map();
      data.forEach((img) => {
        const { pixelData, rows, columns, slope, intercept } = img;
        for (let i = 0; i < rows; i++) {
          let rowPixels = pixelMap.get(i) || [];
          let start = i * columns;
          let pixels = pixelData
            .subarray(start, start + columns)
            .map((row) => row * slope + intercept);

          rowPixels.push(pixels);
          pixelMap.set(i, rowPixels);
          pixels = [];
        }
      });

      return pixelMap;
    };

    const buildTree = (map) => {
      let trees = new Map();
      map.forEach((value, key) => {
        // console.log(key, value);
        let builder = new MipBuilder({ fn: this.method });
        builder.build(value);
        trees.set(key, builder);
        builder = null;
      });

      return trees;
    };

    for (let i = 0; i < planBufferSize; i += 1) {
      this.buffer.push(getBufferItem(i));
    }

    this.buffer.forEach((buff) => {
      const pixelMap = createPixelMap(buff);
      const data = buildTree(pixelMap);
      buff.data = data;
    });
  }

  set imageList(val) {
    this._imageList = val;
    this.buildBuffer();
  }

  get imageList() {
    return this._imageList;
  }
}

export default Mip;
