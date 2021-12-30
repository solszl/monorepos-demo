const imageState = {
  // 即时视窗的窗宽窗位
  wwwc: {
    ww: 0,
    wc: 0,
  },
  // addViewport时设置的窗宽窗位
  initialWWWC: {
    ww: 0,
    wc: 0,
  },
  // dicom影像标签上的窗宽窗位
  imageOriginWWWC: {
    ww: 0,
    wc: 0,
  },
  columns: 0,
  rows: 0,
  seriesId: null,
  sliceId: null,
  pixelData: null,
  imgCanvas: null,
  canvas: null,
  columnPixelSpacing: null,
  rowPixelSpacing: null,
  slope: null,
  intercept: null,
};

let stateDictionary = {};
let stateInitialDictionary = {};
export const useImageState = (stageId) => {
  const setImageState = (newState) => {
    const state = stateDictionary?.[stageId] ?? { ...imageState };
    Object.keys(newState).map((key) => {
      state[key] = newState[key];
    });
    stateDictionary[stageId] = state;
    const [, setInitialImageState] = useImageInitialState(stageId);
    setInitialImageState(state);
  };

  const getImageState = () => {
    return stateDictionary?.[stageId];
  };

  return [getImageState, setImageState];
};

export const useImageInitialState = (stageId) => {
  let state = stateInitialDictionary?.[stageId];
  const setInitialImageState = (newState) => {
    if (!stateInitialDictionary[stageId] && newState.pixelData) {
      stateInitialDictionary[stageId] = { ...newState };
    }
  };
  return [state, setInitialImageState];
};

export const removeImageState = (stageId) => {
  delete stateInitialDictionary[stageId];
  delete stateDictionary[stageId];
};
