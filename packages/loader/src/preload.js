import TaskManager from "./task-manager";

/** @type { number } 前预载多少个 */
const PRE_COUNT = 2;
/** @type { number } 后预载多少个 */
const SUF_COUNT = 1;
class PreloadManager {
  constructor() {
    /** @type {TaskManager} */
    this.taskManager = null;
  }

  /**
   *
   *
   * @param { Task } currentTask
   * @memberof PreloadManager
   */
  buildPreloadTask(currentTask) {
    const loopCount = Math.max(PRE_COUNT, SUF_COUNT);
    const { plane, index, seriesId } = currentTask;

    // index, index+1, index-1, index+2, index-2
    const preloadTasks = [];
    for (let i = 1, j = 1; i <= loopCount; i++, j++) {
      if (j <= PRE_COUNT) {
        const preIndex = index + j;
        const preTask = this.taskManager.getTask(seriesId, plane, preIndex)[0];
        if (preTask) {
          preloadTasks.push(preTask);
        }
      }

      if (i <= SUF_COUNT) {
        const sufIndex = index - i;
        const sufTask = this.taskManager.getTask(seriesId, plane, sufIndex)[0];
        if (sufTask) {
          preloadTasks.push(sufTask);
        }
      }
    }

    while (preloadTasks.length) {
      this.taskManager.addPendingTask(preloadTasks.shift());
    }
  }
}

export default PreloadManager;
