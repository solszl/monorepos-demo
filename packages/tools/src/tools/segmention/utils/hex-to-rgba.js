export const hex2Rgba = (hex, opacity = 1) => {
  if (hex.length !== 7) {
    return "rgba(0,0,0,1)";
  }

  const r = parseInt("0x" + hex.slice(1, 3));
  const g = parseInt("0x" + hex.slice(3, 5));
  const b = parseInt("0x" + hex.slice(5, 7));
  const a = Math.max(0, Math.min(opacity, 1));
  return `rgba(${r},${g},${b},${a})`;
};

export const rgba2Hex = (rgba) => {
  rgba = rgba.replace(/\s+/g, "");
  let pattern = /^rgba?\((\d+),(\d+),(\d+),?(\d*\.\d+)?\)$/;
  let result = pattern.exec(rgba);

  if (!result) {
    throw new Error("wrong rgba format.");
  }

  let colors = [];
  for (let i = 1, len = 4; i < len; i += 1) {
    colors.push(Number(result[i]).toString(16).padStart(2, "0"));
  }

  return {
    color: `#${colors.join("")}`,
    opacity: +result[4] ?? 1,
  };
};

// console.log(hex2Rgba("#abcdef", 0.7));
// console.log(rgba2Hex("rgba(171,205,239,0.7)"));
