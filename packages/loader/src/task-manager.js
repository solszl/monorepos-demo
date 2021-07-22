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

  getTask(seriesId, plane, index) {
    const task = this.tasks.find((task) => {
      return task.seriesId === seriesId && task.plane === plane && task.index === index;
    });
    return task;
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
