import { EVENTS } from "../constants";
const enable = (stage, toolState) => {
  stage.on("mouseenter", (e) => {
    console.log(e);
    const { evt } = e;
    const { button } = evt;

    toolState.getToolInstance(button)?.mouseEnter(evt);
  });

  stage.on("mouseleave", (e) => {
    console.log(e);
    const { evt } = e;
    const { button } = evt;

    toolState.getToolInstance(button)?.mouseLeave(evt);
  });

  stage.on("mouseout", (e) => {
    console.log(e);
    const { evt } = e;
    const { button } = evt;

    toolState.getToolInstance(button)?.mouseOut(evt);
  });

  stage.on("mouseover", (e) => {
    console.log(e);
    const { evt } = e;
    const { button } = evt;

    toolState.getToolInstance(button)?.mouseOver(evt);
  });

  stage.on("mousemove", (e) => {
    // console.log(e);
    const { evt } = e;
    const { button } = evt;

    toolState.getToolInstance(button)?.mouseMove(evt);
  });

  stage.on("mousedown", (e) => {
    console.log(e);
    const { evt } = e;
    const { button } = evt;

    toolState.getToolInstance(button)?.mouseDown(evt);
  });

  stage.on("mouseup", (e) => {
    const { evt } = e;
    const { button } = evt;

    toolState.getToolInstance(button)?.mouseUp(evt);
  });

  stage.on("click", (e) => {
    console.log("click");
    const { evt } = e;
    const { button } = evt;

    const fn = ["mouseClick", "mouseWheelClick", "mouseRightClick"];
    toolState.getToolInstance(button)?.[fn[button]](evt);
  });

  stage.on("dblclick", (e) => {
    const { evt } = e;
    const { button } = evt;

    toolState.getToolInstance(button)?.mouseDoubleClick(evt);
  });
};

const disable = (stage, toolState) => {};

export default { enable, disable };
