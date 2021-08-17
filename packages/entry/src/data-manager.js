class DataManager {
  constructor() {
    this.viewports = {};
  }

  addViewport(viewport) {
    const { id } = viewport;
    this.viewports[id] = { sliceData: [] };
  }

  removeViewport(viewport) {
    const { id } = viewport;
    delete this.viewports[id];
  }

  update() {
    // according tool data id and viewport id, update it.
  }

  purge(viewport, sliceId) {}
}

export default DataManager;
