import { createImage } from "@pkg/remote/src";
import { API_METHOD } from "../constants";

const getMinMaxValues = (pixelData) => {
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

  return { minPixelValue: min, maxPixelValue: max };
};

class Axial {
  constructor(config = {}) {
    this.config = config;
  }

  getLength() {
    const {
      tags: { shape },
    } = this.config;
    return shape[2];
  }

  async getImage(index) {
    const { tags, session } = this.config;
    const data = await session.call(API_METHOD.plane("axial"), [], {
      x: 0,
      y: 0,
      z: index,
    });
    const image = await createImage(
      data.pixel,
      Object.assign(
        {},
        tags,
        { columns: data.columns, rows: data.rows },
        { spacing: [data.spacingX, data.spacingY, data.spacingZ] },
        getMinMaxValues(data.pixel)
      )
    );

    return image;
  }
}

class Sagittal {
  constructor(config = {}) {
    this.config = config;
  }

  getLength() {
    const {
      tags: { shape },
    } = this.config;
    return shape[2];
  }

  async getImage(index) {
    const { tags, session } = this.config;
    const data = await session.call(API_METHOD.plane("sagittal"), [], {
      x: index,
      y: 0,
      z: 0,
    });
    const image = await createImage(
      data.pixel,
      Object.assign(
        {},
        tags,
        { columns: data.columns, rows: data.rows },
        { spacing: [data.spacingX, data.spacingY, data.spacingZ] },
        getMinMaxValues(data.pixel)
      )
    );

    return image;
  }
}

class Coronary {
  constructor(config = {}) {
    this.config = config;
  }

  getLength() {
    const {
      tags: { shape },
    } = this.config;
    return shape[2];
  }

  async getImage(index) {
    const { tags, session } = this.config;
    const data = await session.call(API_METHOD.plane("coronary"), [], {
      x: 0,
      y: index,
      z: 0,
    });
    const image = await createImage(
      data.pixel,
      Object.assign(
        {},
        tags,
        { columns: data.columns, rows: data.rows },
        { spacing: [data.spacingX, data.spacingY, data.spacingZ] },
        getMinMaxValues(data.pixel)
      )
    );

    return image;
  }
}

const MPR_CONSTRUCTOR = {
  axial: Axial,
  sagittal: Sagittal,
  coronary: Coronary,
};

export class MPR {
  constructor(config = {}) {
    this.config = config;
    this.planeDictionary = new Map();
  }

  getBasis(plane) {
    if (!this.planeDictionary.has(plane)) {
      // 轴位的基础tag信息
      const { config } = this;
      const planeInstance = new MPR_CONSTRUCTOR[plane](config);
      this.planeDictionary.set(plane, planeInstance);
    }

    return this.planeDictionary.get(plane);
  }
}
