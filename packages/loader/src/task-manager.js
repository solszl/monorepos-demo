class TaskManager {
  constructor() {
    this.tasks = [];
    this.pendingTask = [];
  }

  getTasks() {
    return this.tasks;
  }

  addTask(obj) {
    this.tasks.push(new Task(obj));
  }

  pickTask() {
    return this.tasks.shift();
  }

  modifyTaskPriority(property, value, priority) {
    this.tasks = this.tasks.map((task) => {
      if (task?.[property] === value) {
        task.priority = priority;
      }

      return task;
    });

    this.sort(this.tasks);
  }

  sort(tasks) {
    tasks.sort((a, b) => a.priority - b.priority);
  }

  // getTask(seriesId, plane, index) {
  //   const task = this.tasks.find((task) => {
  //     return task.seriesId === seriesId && task.plane === plane && task.index === index;
  //   });
  //   return task;
  // }

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
    task.priority = Date.now();
    this.pendingTask.push(task);
    this.sort(this.pendingTask);
  }
}

/**
 * Task
 *
 * @class Task
 */
class Task {
  constructor(obj) {
    const { url = "", seriesId = "", plane = "", index } = obj;
    this.priority = 0;
    this.imageUrl = url;
    this.seriesId = seriesId;
    this.plane = plane;
    this.index = index;
  }
}

export default TaskManager;
