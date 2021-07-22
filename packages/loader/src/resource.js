import LoaderManager from "./loader-manager";
import CacheManager from "./cache-manager";

class Resource {
  constructor() {
    this.loaderManager = new LoaderManager();
    this.cacheManager = new CacheManager();
    this.loaderManager.cacheManager = this.cacheManager;
  }

  /**
   *
   *
   * @param { string} seriesId
   * @param { Array } imageUrls
   * @param { string } [plane="axis"]
   * @memberof Resource
   */
  addItemUrls(seriesId, imageUrls, plane = "axis") {
    imageUrls.forEach((url, index) => {
      this.loaderManager.taskManager.addTask({ seriesId, url, plane, index });
    });
  }

  /**
   *
   *
   * @param { string } seriesId
   * @param { Array<string, object>} objArray
   * @param { string } [plane="axis"]
   * @memberof Resource
   */
  cacheItems(seriesId, objArray, plane = "axis") {
    objArray.forEach((obj) => {
      this.cacheItem(seriesId, obj, plane);
    });
  }

  cacheItem(seriesId, obj, plane = "axis") {
    this.cacheManager.cache(seriesId, obj, plane);
  }

  async getImage(seriesId, index, plane = "axis") {
    return new Promise((resolve, reject) => {
      const image = this.cacheManager.getItem(seriesId, index, plane);
      if (image) {
        resolve(image);
        return;
      }

      // TODO: load item and cache it.
      const task = this.loaderManager.taskManager.getTask(seriesId, plane, index);
      if (!task) {
        console.error(`not have task ${seriesId}, ${plane}, ${index}.`);
        return;
      }

      task.resolve = resolve;
      this.loaderManager.taskManager.addPendingTask(task);
      this.loaderManager.load();
    });

    // const { image1 } = await this.loaderManager.load();
    // this.cacheManager.cacheItem(seriesId, { key: index, value: image1 }, plane);
    // return image1;
  }

  purgeCache(seriesId, plane) {
    this.cacheManager.purge(seriesId, plane);
  }
}

export default Resource;
