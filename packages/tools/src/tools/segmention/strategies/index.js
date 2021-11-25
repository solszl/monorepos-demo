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
  return strategies["draw"]?.[strategy];
};

export const getEraseStrategy = (strategy) => {
  return strategies["erase"]?.[strategy];
};

export const getStrategy = (strategy) => {
  return getDrawStrategy(strategy) ?? getEraseStrategy(strategy) ?? undefined;
};

export default {};
