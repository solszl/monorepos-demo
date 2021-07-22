import TaskManager from "./task-manager";
import LoaderWorker from "./workers/loader.worker";
import PromiseWorker from "promise-worker";

/** @type { Boolean } 是否是xp系统 */
const isXP = /Windows NT 5\.1.+Chrome\/49/.test(navigator.userAgent);

class LoaderManager {
  constructor() {
    this.workers = [];
    this.taskManager = new TaskManager();
    this.cacheManager = null;

    this.initLoader();
  }

  initLoader() {
    // 非xp留出一个加载线程供其他请求
    const workerCount = isXP ? 2 : Math.max(navigator.hardwareConcurrency - 1, 0);

    this.workers = Array.from(new Array(workerCount), (_, i) => i + 1).map((i) => {
      const worker = new LoaderWorker();
      const promiseWorker = new PromiseWorker(worker);
      promiseWorker.id = i;
      promiseWorker.working = false;
      // worker.onmessage = (e) => {
      //   console.log("加载完了");
      //   this.workerCallback(worker, e);
      // };
      return promiseWorker;
    });

    console.log(this.workers);
  }

  // workerCallback(worker, e) {
  //   worker.working = false;
  // }

  async load() {
    // for (const worker of this.workers) {
    //   if (!worker.working && this.taskManager.hasPendingTask()) {
    //     worker.working = true;
    //     const task = this.taskManager.pendingTask.shift();
    //     worker.postMessage(task);
    //   }
    // }

    if (!this.taskManager.hasPendingTask()) {
      return;
    }

    if (this.workers.length === 0) {
      this.startCheck();
      return;
    }

    const worker = this.workers.shift();
    worker.working = true;
    const task = this.taskManager.pendingTask.shift();
    const { resolve } = task;
    delete task.resolve;
    const data = await worker.postMessage(task);
    worker.working = false;
    this.workers.push(worker);

    const { seriesId, plane, index } = task;
    this.cacheManager.cacheItem(seriesId, { key: index, value: data }, plane);
    resolve(data);
  }

  startCheck() {
    if (this.workers.length > 0) {
      this.load();
      return;
    }

    if (!this.taskManager.hasPendingTask()) {
      cancelAnimationFrame(this.xx);
      return;
    }
    this.xx = requestAnimationFrame(this.startCheck.bind(this));
  }
}

export default LoaderManager;
