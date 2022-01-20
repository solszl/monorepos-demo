class TaskManager {
  constructor() {
    this.tasks = [];
    this.pendingTask = [];
    this.loadingTask = {};
    this.pendingTaskResolves = {};
  }

  getTasks() {
    return this.tasks;
  }

  addTask(obj) {
    this.tasks.push(new Task(obj));
  }

  sort(tasks) {
    // tasks.sort((a, b) => a.priority - b.priority);
    tasks.sort((a, b) => {
      if (a.resolve && b.resolve) {
        return b.priority - a.priority;
      } else {
        if (a.resolve) {
          return -1;
        } else if (b.resolve) {
          return 1;
        } else {
          return b.priority - a.priority;
        }
      }
    });
  }

  /**
   * 参数顺序为,seriesId, plane, index 可以都不传
   *
   * @param {*} args
   * @return {*}
   * @memberof TaskManager
   */
  getTask(...args) {
    const { length } = args;
    const [seriesId, plane, index] = args;
    const fn0 = (task) => task;
    const fn1 = (task) => task.seriesId === seriesId;
    const fn2 = (task) => task.seriesId === seriesId && task.plane === plane;
    const fn3 = (task) =>
      task.seriesId === seriesId && task.plane === plane && task.index === index;
    const sortFn = [fn0, fn1, fn2, fn3];

    return this.getTasks().filter(sortFn[length]);
  }

  hasPendingTask() {
    return this.pendingTask.length > 0;
  }

  /**
   *
   *
   * @param { Task } task
   * @memberof TaskManager
   */
  addPendingTask(task) {
    // 插队的时候，先在pending队列里找一下，是否已经存在对应task，如果有的话，更新task的优先级。否则插入新的task
    const existIndex = this.pendingTask.findIndex((t) => {
      return t.plane === task.plane && t.seriesId === task.seriesId && t.index === task.index;
    });

    if (existIndex !== -1) {
      const oldTask = this.pendingTask[existIndex];
      oldTask.priority = Date.now();
    } else {
      task.priority = Date.now();
      this.pendingTask.push(task);
    }

    this.sort(this.pendingTask);
  }

  /**
   * 如果某个任务已经出于pending状态，需要将其resolve函数缓存起来。 待load完毕后。逐一resolve
   *
   * @param { Task } task
   * @param {*} resolve
   * @memberof TaskManager
   */
  addResolveToPendingTask(task, resolve) {
    const resolves = this.pendingTaskResolves[task.imageUrl] ?? [];
    resolves.push(resolve);
    this.pendingTaskResolves[task.imageUrl] = resolves;
  }

  addLoadingTask(task, resolve) {
    if (!this.loadingTask[task.imageUrl]) {
      this.loadingTask[task.imageUrl] = [];
    }

    this.loadingTask[task.imageUrl].push(task.resolve ?? resolve);
  }

  removeLoadingTask(task, img) {
    const resolves = this.loadingTask[task.imageUrl];
    resolves?.forEach((resolve) => resolve?.(img));
    delete this.loadingTask[task.imageUrl];

    const resoves2 = this.pendingTaskResolves[task.imageUrl];
    resoves2?.forEach((resolve) => resolve?.(img));
    delete this.pendingTaskResolves[task.imageUrl];
  }

  taskIsLoading(task) {
    return !!this.loadingTask[task.imageUrl];
  }

  taskIsPending(task) {
    return (
      this.pendingTask.findIndex((t) => {
        return t.plane === task.plane && t.seriesId === task.seriesId && t.index === task.index;
      }) !== -1
    );
  }

  removeTasks(seriesId) {
    this.tasks.map((task) => {
      if (task.seriesId === seriesId) {
        task.remove = true;
      }
    });

    this.tasks = this.tasks.filter((task) => !task?.remove).map((task) => task);
  }
}

/**
 * Task
 *
 * @class Task
 */
class Task {
  constructor(obj) {
    const { url = "", seriesId = "", plane = "", index, format = "dicom" } = obj;
    this.priority = 0;
    this.imageUrl = url;
    this.seriesId = seriesId;
    this.plane = plane;
    this.index = index;
    this.format = format;
  }
}

export default TaskManager;
