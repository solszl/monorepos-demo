const ee = {
  mouseenter: (e, toolState) => {
    const { evt } = e;
    const { which } = evt;
    toolState.getToolInstance(which)?.mouseEnter(e);
  },
  mouseleave: (e, toolState) => {
    const { evt } = e;
    const { which } = evt;
    toolState.getToolInstance(which)?.mouseLeave(e);
  },
  mouseout: (e, toolState) => {
    // console.log(e);
    const { evt } = e;
    const { which } = evt;

    toolState.getToolInstance(which)?.mouseOut(e);
  },
  mouseover: (e, toolState) => {
    // console.log(e);
    const { evt } = e;
    const { which } = evt;

    toolState.getToolInstance(which)?.mouseOver(e);
  },
  mousemove: (e, toolState) => {
    // console.log(e);
    const { evt } = e;
    const { which } = evt;

    toolState.getToolInstance(which)?.mouseMove(e);
  },
  mousedown: (e, toolState) => {
    // console.log(e);
    const { evt } = e;
    const { which } = evt;
    if (e.target?.nodeType !== "Stage") {
      return;
    }
    toolState.getToolInstance(which, true)?.mouseDown(e);
  },
  mouseup: (e, toolState) => {
    const { evt } = e;
    const { which } = evt;

    toolState.getToolInstance(which)?.mouseUp(e);
  },
  click: (e, toolState) => {
    const { evt } = e;
    const { which } = evt;
    const fn = ["mouseClick", "mouseWheelClick"];
    toolState.getToolInstance(which)?.[fn[which]]?.(e);
  },
  contextmenu: (e, toolState) => {
    e.evt.preventDefault();
    const { evt } = e;
    const { which } = evt;
    toolState.getToolInstance(which)?.mouseRightClick(e);
  },
  dblclick: (e, toolState) => {
    const { evt } = e;
    const { which } = evt;

    toolState.getToolInstance(which)?.mouseDoubleClick(e);
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
