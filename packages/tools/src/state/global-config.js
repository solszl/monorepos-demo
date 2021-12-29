export const TOOL_CONFIG = {
  // 窗宽窗位调整默认步长
  wwwc: {
    wwStep: 1,
    wcStep: 1,
  },
  // CT点值后缀文案
  ct: {
    ctText: "点值",
  },
  // 区域测量的文案
  ellipse_roi: {
    areaText: "面积",
    varianceText: "方差",
    avgText: "平均值",
    maxText: "最大值",
    minText: "最小值",
  },
  // 长度测量的文案
  length: {
    suffixText: "mm",
  },
};

let configDictionary = {};
export const useGlobalConfig = (stageId) => {
  const setGlobalConfig = (newConfig) => {
    const state = configDictionary?.[stageId] ?? { ...TOOL_CONFIG };
    Object.keys(newConfig).map((key) => {
      if (typeof state[key] === "object") {
        state[key] = Object.assign({}, state[key], newConfig[key]);
      } else {
        state[key] = newConfig[key];
      }
    });
    configDictionary[stageId] = state;
  };

  const getGlobalConfig = () => {
    return configDictionary?.[stageId];
  };

  return [getGlobalConfig, setGlobalConfig];
};
