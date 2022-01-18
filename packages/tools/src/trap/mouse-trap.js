import { INTERNAL_EVENTS } from "../constants";
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
    const { evt } = e;
    const { which } = evt;

    toolState.getToolInstance(which)?.mouseOut(e);
  },
  mouseover: (e, toolState) => {
    const { evt } = e;
    const { which } = evt;

    toolState.getToolInstance(which)?.mouseOver(e);
  },
  mousemove: (e, toolState) => {
    const { evt } = e;
    const { which } = evt;

    toolState.getToolInstance(which)?.mouseMove(e);
  },
  mousedown: (e, toolState) => {
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

    const { evt, target } = e;

    let temp = target;
    while (temp) {
      if (temp?.$txComponent) {
        const {
          $stage: stage,
          data: { id },
          type,
        } = temp;
        stage.fire(INTERNAL_EVENTS.TOOL_CONTEXTMENU_CLICK, {
          id,
          position: {
            x: evt.layerX,
            y: evt.layerY,
          },
          toolType: type,
        });
        break;
      }
      temp = temp.parent;
    }
    const { which } = evt;
    toolState.getToolInstance(which)?.mouseRightClick(e);
  },
  dblclick: (e, toolState) => {
    const { evt } = e;
    const { which } = evt;

    toolState.getToolInstance(which)?.mouseDoubleClick(e);
  },
  wheel: (e, toolState) => {
    [1, 2, 3].map((button) => {
      toolState.getToolInstance(button)?.mouseWheel(e);
    });

    if (toolState.getToolType(4) && !toolState.getToolInstance(4)) {
      toolState.getToolInstance(4, true);
    }
    toolState.getToolInstance(4)?.mouseWheel(e);
  },
};

const documentEE = {
  mousemove: (e, toolState) => {
    const { which } = e;
    toolState.getToolInstance(which)?.documentMouseMove(e);
  },
  mouseup: (e, toolState) => {
    const { which } = e;
    toolState.getToolInstance(which)?.documentMouseUp(e);
  },
};

const clones = {};
const enable = (stage, toolState) => {
  toolState.$stage = stage;
  // remove old event listeners
  Reflect.ownKeys(ee).forEach((key) => {
    const k = `${key}-${stage.id()}`;
    stage.off(key, clones[k]);
    delete clones[k];
  });

  Reflect.ownKeys(ee).forEach((key) => {
    const k = `${key}-${stage.id()}`;
    clones[k] = (evt) => {
      ee[key](evt, toolState);
    };
    stage.on(key, clones[k]);
  });

  // document
  Reflect.ownKeys(documentEE).forEach((key) => {
    const documentKey = `document-${key}-${stage.id()}`;
    document.removeEventListener(key, clones[documentKey]);
    delete clones[documentKey];
  });

  Reflect.ownKeys(documentEE).forEach((key) => {
    const documentKey = `document-${key}-${stage.id()}`;
    clones[documentKey] = (evt) => {
      documentEE[key](evt, toolState);
    };
    document.addEventListener(key, clones[documentKey]);
  });
};

const disable = (stage, toolState) => {};

export default { enable, disable };
