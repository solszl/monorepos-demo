import EraserDauber from "./eraserDauber";
import FillDauber from "./fillDauber";
const strategies = {
  draw: {
    dauber: FillDauber,
    // freehand
    // circle
    // rectangle
    // correction
  },
  erase: {
    dauber: EraserDauber,
    // freehand
  },
};

export const getDrawStrategy = (strategy) => {
  const Clazz = strategies["draw"]?.[strategy];
  return new Clazz();
};

export const getEraseStrategy = (strategy) => {
  const Clazz = strategies["erase"]?.[strategy];
  return new Clazz();
};

export const getStrategy = (strategy) => {
  return getDrawStrategy(strategy) ?? getEraseStrategy(strategy) ?? undefined;
};

export default {};
