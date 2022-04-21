import * as THREE from "three";

class Cube {
  constructor(opt = {}) {
    this.opt = opt;

    const materials = [];
    let labels = this.opt["label"] ?? ["L", "R", "P", "A", "S", "I"];

    labels.forEach((label, index) => {
      const material = new THREE.MeshBasicMaterial({
        map: this._createTexture(label, index),
      });
      materials.push(material);
    });

    const size = this.opt["containerWidth"] || 80;
    const cubeGeo = new THREE.BoxBufferGeometry(size, size, size);
    const cube = new THREE.Mesh(cubeGeo, materials);
    this.cubeMesh = cube;
  }

  getMesh() {
    return this.cubeMesh;
  }

  _createTexture(label, index) {
    const rotateLabel = this.opt["rotateLabel"];
    const size = this.opt["containerWidth"] || 80;
    const c = document.createElement("canvas");
    const w = size;
    const h = size;
    c.width = w;
    c.height = h;
    c.style.width = `${w}px`;
    c.style.height = `${h}px`;

    const ctx = c.getContext("2d");
    ctx.strokeStyle = "#0164FE";
    ctx.strokeRect(0, 0, w, h);

    ctx.translate(w / 2, h / 2);
    ctx.rotate((rotateLabel[index] * Math.PI) / 180);
    ctx.translate(-w / 2, -h / 2);

    ctx.font = "24px Arial";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    const pos = size >> 1;
    ctx.fillText(label, pos, pos + 6);

    const texture = new THREE.CanvasTexture(c);
    texture.needsUpdate = true;
    return texture;
  }
}

export default Cube;
