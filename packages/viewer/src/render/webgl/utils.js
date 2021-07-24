/**
 *
 * @returns webgl是否支持
 */
export const webglSupported = () => {
  // Adapted from
  // http://stackoverflow.com/questions/9899807/three-js-detect-webgl-support-and-fallback-to-regular-canvas

  const options = {
    failIfMajorPerformanceCaveat: true,
  };

  try {
    const canvas = document.createElement("canvas");

    return (
      !!window.WebGLRenderingContext &&
      (canvas.getContext("webgl2", options) ||
        canvas.getContext("webgl", options) ||
        canvas.getContext("experimental-webgl", options))
    );
  } catch (e) {
    return false;
  }
};
