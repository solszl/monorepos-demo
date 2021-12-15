// export default function () {
//   const canvas = document.createElement("canvas");
//   canvas.width = 256;
//   canvas.height = 20;
//   canvas.style.width = "256px";
//   canvas.style.height = "20px";
//   canvas.style.position = "fixed";

//   const context = canvas.getContext("2d");
//   const gradient = context.createLinearGradient(0, 0, canvas.width - 1, canvas.height - 1);
//   gradient.addColorStop(0.1, "#ffffff");
//   gradient.addColorStop(0.5, "#ff9900");
//   gradient.addColorStop(1.0, "#ff0000");

//   context.fillStyle = gradient;
//   context.fillRect(0, 0, canvas.width, canvas.height);

//   return context;
// }

class Colormap {
  constructor() {
    this.colors = null;
  }

  addColors(colors) {
    this.colors = colors;
  }
  addColor(percent, hex) {
    this.colors[percent] = hex;
  }

  buildLut(min, max) {
    let range = Math.abs(Math.max(min, max) - Math.min(min, max));
    console.log(range);
  }

  lerp(a, b, amount) {
    var ah = parseInt(a.replace(/#/g, ""), 16),
      ar = ah >> 16,
      ag = (ah >> 8) & 0xff,
      ab = ah & 0xff,
      bh = parseInt(b.replace(/#/g, ""), 16),
      br = bh >> 16,
      bg = (bh >> 8) & 0xff,
      bb = bh & 0xff,
      rr = ar + amount * (br - ar),
      rg = ag + amount * (bg - ag),
      rb = ab + amount * (bb - ab);

    return "#" + (((1 << 24) + (rr << 16) + (rg << 8) + rb) | 0).toString(16).slice(1);
  }
}

export default Colormap;
