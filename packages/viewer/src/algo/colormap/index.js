class Color {
  constructor(color) {
    this._r = "";
    this._g = "";
    this._b = "";
    this.rgb = null;
    this.hsl = null;

    if (color) {
      this.setColor(color);
    }
  }

  setColor(val) {
    // 只能是"#RRGGBB"

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(val);
    this._r = parseInt(result[1], 16);
    this._g = parseInt(result[2], 16);
    this._b = parseInt(result[3], 16);
    this.rgb = [this.r, this.g, this.b];
  }

  toHSL() {
    const { rgb: color } = this;
    var r = color[0] / 255;
    var g = color[1] / 255;
    var b = color[2] / 255;

    var max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    var h,
      s,
      l = (max + min) / 2;

    if (max == min) {
      h = s = 0; // achromatic
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    this.hsl = [h, s, l];
    return this.hsl;
  }

  toRGB() {
    const { hsl: color } = this;
    var l = color[2];

    if (color[1] == 0) {
      l = Math.round(l * 255);
      this.rgb = [l, l, l];
    } else {
      function hue2rgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      }

      var s = color[1];
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      var r = hue2rgb(p, q, color[0] + 1 / 3);
      var g = hue2rgb(p, q, color[0]);
      var b = hue2rgb(p, q, color[0] - 1 / 3);
      this.rgb = [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    return this.rgb;
  }

  toRGBString() {
    const { rgb } = this;
    return "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
  }

  get r() {
    return this._r;
  }

  get g() {
    return this._g;
  }

  get b() {
    return this._b;
  }
}

class Colormap {
  constructor() {}

  setOption(option) {
    this.option = option;
    /*
      {
        percents: {
          0: '#FF0000',
          50: '#0000FF',
          100: '#00FF00'
        },
        type: 'hsl'
      }
    */
  }

  build(amount) {
    const { percents, type } = this.option;
    if (type === "hsl") {
      const c1 = percents[0] ?? "#FF0000";
      const c2 = percents[100] ?? "#0000FF";
      return this.lerpHSL(new Color(c1), new Color(c2), amount);
    } else if (type === "rgb") {
      const keys = Object.keys(percents).sort((a, b) => a - b);
      let result = [];
      for (let i = 0; i < keys.length - 1; i += 1) {
        const c1 = percents[keys[i]];
        const c2 = percents[keys[i + 1]];
        const steps = Math.floor(((keys[i + 1] - keys[i]) / 100) * amount);
        let lerped = this.lerpRGB(new Color(c1), new Color(c2), steps);
        result = [...result, ...lerped];
      }
      return result;
    } else {
    }
  }

  lerpHSL(color1, color2, amount) {
    color1.toHSL();
    color2.toHSL();

    const tempColor = new Color();
    let lerp = [];
    const factor = 1 / (amount - 1);
    for (let i = 0; i < amount; i += 1) {
      const hsl1 = [...color1.hsl];
      const hsl2 = [...color2.hsl];
      for (var j = 0; j < 3; j += 1) {
        hsl1[j] += factor * i * (hsl2[j] - hsl1[j]);
      }
      tempColor.hsl = hsl1;
      lerp.push(tempColor.toRGB());
    }

    return lerp;
  }

  lerpRGB(color1, color2, amount) {
    const tempColor = new Color();
    let lerp = [];
    const factor = 1 / (amount - 1);
    for (let i = 0; i < amount; i += 1) {
      const rgb1 = [...color1.rgb];
      const rgb2 = [...color2.rgb];
      for (var j = 0; j < 3; j += 1) {
        rgb1[j] = Math.round(rgb1[j] + factor * i * (rgb2[j] - rgb1[j]));
      }
      tempColor.rgb = rgb1;
      lerp.push(rgb1);
    }

    return lerp;
  }
}

// let colormap = new Colormap();
// colormap.setOption({
//   percents: {
//     // 0: "#5e4fa2",
//     0: "#ff0000",
//     50: "#00ccFF",
//     // 100: "#f79459",
//     100: "#0000ff",
//   },
//   // type: "rgb",
//   type: "hsl",
// });
// let lerp = colormap.build(30);

// console.log(lerp);

export default Colormap;
