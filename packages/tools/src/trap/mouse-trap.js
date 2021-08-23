const ee = {
  mouseenter: (e, toolState) => {
    const { evt } = e;
    const { button } = evt;
    toolState.getToolInstance(button)?.mouseEnter(e);
  },
  mouseleave: (e, toolState) => {
    const { evt } = e;
    const { button } = evt;
    toolState.getToolInstance(button)?.mouseLeave(e);
  },
  mouseout: (e, toolState) => {
    // console.log(e);
    const { evt } = e;
    const { button } = evt;

    toolState.getToolInstance(button)?.mouseOut(e);
  },
  mouseover: (e, toolState) => {
    // console.log(e);
    const { evt } = e;
    const { button } = evt;

    toolState.getToolInstance(button)?.mouseOver(e);
  },
  mousemove: (e, toolState) => {
    // console.log(e);
    const { evt } = e;
    const { button } = evt;

    toolState.getToolInstance(button)?.mouseMove(e);
  },
  mousedown: (e, toolState) => {
    // console.log(e);
    const { evt } = e;
    const { button } = evt;
    if (e.target?.nodeType !== "Stage") {
      return;
    }
    toolState.getToolInstance(button, true)?.mouseDown(e);
  },
  mouseup: (e, toolState) => {
    const { evt } = e;
    const { button } = evt;

    toolState.getToolInstance(button)?.mouseUp(e);
  },
  click: (e, toolState) => {
    const { evt } = e;
    const { button } = evt;
    const fn = ["mouseClick", "mouseWheelClick", "mouseRightClick"];
    toolState.getToolInstance(button)?.[fn[button]](e);
  },
  dblclick: (e, toolState) => {
    const { evt } = e;
    const { button } = evt;

    toolState.getToolInstance(button)?.mouseDoubleClick(e);
  },
};

const clones = {};
const enable = (stage, toolState) => {
  toolState.$stage = stage;
  // remove old event listeners
  Reflect.ownKeys(ee).forEach((key) => {
    stage.off(key, clones[key]);
    delete clones[key];
  });

  Reflect.ownKeys(ee).forEach((key) => {
    clones[key] = (evt) => {
      ee[key](evt, toolState);
    };
    stage.on(key, clones[key]);
  });
};

const disable = (stage, toolState) => {};

export default { enable, disable };
