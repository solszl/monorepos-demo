export const useCursor = (component, cursor = "auto") => {
  const stage = component.getStage();
  if (stage) {
    stage.container().style.cursor = cursor || "auto";
  }
};
