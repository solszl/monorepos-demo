import { data } from "./data";
const partial = (name) => {
  if (name.endsWith("_r")) {
    return function (x) {
      return evaluate_cmap(x, name.substring(0, name.length - 2), true);
    };
  } else {
    return function (x) {
      return evaluate_cmap(x, name, false);
    };
  }
};

// image samples from https://github.com/timothygebhard/js-colormaps/blob/master/images/overview.png
const jet = partial("jet");
const jet_r = partial("jet_r");
const turbo = partial("turbo");
const turbo_r = partial("turbo_r");

const interpolated = (x, colors) => {
  let lo = Math.floor(x * (colors.length - 1));
  let hi = Math.ceil(x * (colors.length - 1));
  let r = Math.round(((colors[lo][0] + colors[hi][0]) / 2) * 255);
  let g = Math.round(((colors[lo][1] + colors[hi][1]) / 2) * 255);
  let b = Math.round(((colors[lo][2] + colors[hi][2]) / 2) * 255);
  return [r, g, b];
};

const qualitative = (x, colors) => {
  let idx = 0;
  while (x > (idx + 1) / (colors.length - 0)) {
    idx++;
  }
  let r = Math.round(colors[idx][0] * 255);
  let g = Math.round(colors[idx][1] * 255);
  let b = Math.round(colors[idx][2] * 255);
  return [r, g, b];
};

/*
Define auxiliary functions for evaluating colormaps
 */

export const evaluate_cmap = (x, name, reverse) => {
  /**
   * Evaluate colormap `name` at some value `x`.
   * @param {number} x - The value (between 0 and 1) at which to evaluate the colormap.
   * @param {string} name - The name of the colormap (see matplotlib documentation).
   * @reverse {boolean} reverse - Whether or not to reverse the colormap.
   * @return {list} - A 3-tuple (R, G, B) containing the color assigned to `x`.
   */

  // Ensure that the value of `x` is valid (i.e., 0 <= x <= 1)
  if (!(0 <= x <= 1)) {
    alert("Illegal value for x! Must be in [0, 1].");
  }

  // Ensure that `name` is a valid colormap
  if (!(name in data)) {
    alert("Colormap " + name + "does not exist!");
  }

  // We can get the reverse colormap by evaluating colormap(1-x)
  if (reverse === true) {
    x = 1 - x;
  }

  // Get the colors and whether or not we need to interpolate
  let colors = data[name]["colors"];
  let interpolate = data[name]["interpolate"];

  if (interpolate === true) {
    return interpolated(x, colors);
  } else {
    return qualitative(x, colors);
  }
};
