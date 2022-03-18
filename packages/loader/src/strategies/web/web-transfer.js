import CacheManager from "./../../cache-manager";
import LoaderManager from "./../../loader-manager";
import PreloadManager from "./../../preload";
import TaskManager from "./../../task-manager";

class WebTransfer {
  constructor(config = {}) {
    // 加载管理器
    this.loaderManager = new LoaderManager();
    // 预加载管理器
    this.preloadManager = new PreloadManager();
    // 缓存管理器
    this.cacheManager = new CacheManager();
    // 任务管理器
    this.taskManager = new TaskManager();
    this.loaderManager.cacheManager = this.cacheManager;
    this.loaderManager.taskManager = this.taskManager;
    this.preloadManager.taskManager = this.taskManager;
  }

  async init() {
    return true;
  }

  /**
   *
   * @param { string} seriesId
   * @param { Array } imageUrls
   * @param { string } [plane="axis"]
   * @memberof Resource
   */
  addItemUrls(seriesId, imageUrls, plane = "axis", format = "dicom") {
    imageUrls.forEach((url, index) => {
      this.taskManager.addTask({ seriesId, url, plane, index, format });
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
    this.cacheManager.cacheItem(seriesId, obj, plane);
  }

  loadSeries(seriesId, plane) {
    this.loaderManager.loadSeries(seriesId, plane);
  }

  purgeCache(seriesId, plane) {
    this.cacheManager.purge(seriesId, plane);
  }

  purgeTasks(seriesId) {
    this.taskManager.removeTasks(seriesId);
  }

  getImages(seriesId, plane) {
    return this.cacheManager.getItems(seriesId, plane);
  }

  async getImage(seriesId, index, plane = "axis") {
    return new Promise((resolve, reject) => {
      const image = this.cacheManager.getItem(seriesId, index, plane);
      if (image) {
        resolve(image);
        this.preloadManager.buildPreloadTask({ seriesId, plane, index });
        this.loaderManager.load();
        return;
      }

      const task = this.taskManager.getTask(seriesId, plane, index)[0];
      if (!task) {
        console.error(`not have task ${seriesId}, ${plane}, ${index}.`);
        return;
      }

      // 如果这个url的图片正在加载中，把这个promise 添加进去。等图片加载完后一并resolve
      if (this.taskManager.taskIsLoading(task)) {
        this.taskManager.addLoadingTask(task, resolve);
        return;
      }

      if (this.taskManager.taskIsPending(task)) {
        this.taskManager.addResolveToPendingTask(task, resolve);
        return;
      }

      task.resolve = resolve;
      this.taskManager.addPendingTask(task);

      this.preloadManager.buildPreloadTask({ seriesId, plane, index });
      this.loaderManager.load();
    });
  }

  getIllegalIndex(index, seriesId, plane, loop) {
    const length = this.getTotal(seriesId, plane);
    if (loop && index >= length) {
      return 0;
    }

    return Math.max(0, Math.min(index, length - 1));
  }

  getTotal(seriesId, plane) {
    const { length } = this.taskManager.getTask(seriesId, plane);
    return length;
  }

  dispose() {
    // 缓存管理器
    this.cacheManager.purge();
    // 任务管理器
    this.taskManager.clear();
    // 加载管理器
    this.loaderManager.clear();
    // 预加载管理器
    this.preloadManager.clear();
  }
}

export default WebTransfer;
