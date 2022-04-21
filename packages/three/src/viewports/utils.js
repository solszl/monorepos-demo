import * as THREE from "three";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";

export const getCenter = (group) => {
  const spheres = [];
  for (let obj of group.children) {
    const geo = obj.geometry;
    if (geo && geo.boundingSphere) {
      const sphere = geo.boundingSphere;
      if (sphere.radius !== 0) {
        spheres.push(sphere.clone());
      }
    }
  }

  const { center, radius } =
    spheres.reduce((sp0, sp1) => {
      if (sp0) {
        const {
          center: { x: x0, y: y0, z: z0 },
          radius: r0,
        } = sp0;
        const {
          center: { x: x1, y: y1, z: z1 },
          radius: r1,
        } = sp1;

        const dist = sp0.center.distanceTo(sp1.center);
        const u = [(x1 - x0) / dist, (y1 - y0) / dist, (z1 - z0) / dist];
        const a = new THREE.Vector3(x0 - u[0] * r0, y0 - u[1] * r0, z0 - u[2] * r0);
        const b = new THREE.Vector3(x1 + u[0] * r1, y1 + u[1] * r1, z1 + u[2] * r1);
        return {
          center: new THREE.Vector3((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2),
          radius: a.distanceTo(b) / 2,
        };
      } else {
        return sp1;
      }
    }, null) || {};

  return {
    center,
    radius,
  };
};

export const createTooltip = (data = [], scene) => {
  scene.children = [];
  data.forEach((obj) => {
    const { label, position } = obj;
    const annotationDiv = document.createElement("div");
    annotationDiv.className = "annotationLabel";
    annotationDiv.innerHTML = label;
    const annotationLabel = new CSS2DObject(annotationDiv);
    annotationLabel.position.fromArray(position);
    scene.add(annotationLabel);
  });
};

let lastRotateAngles = { x: 0, y: 0, z: 0 };

const calcLAOorRAO = (z) => {
  let dir = z <= 0 && z > -180 ? "LAO" : "RAO";
  let angle = dir === "LAO" ? -z : z;
  return { dir, angle };
};

const calcCranialorCaudal = (x) => {
  let dir = x >= -90 && x < 90 ? "Cranial" : "Caudal";
  let angle = dir === "Cranial" ? x + 90 : x <= -90 && x > -180 ? -90 - x : 270 - x;
  return { dir, angle };
};

const needExecuteCallback = (x, y, z) => {
  const { x: ox, y: oy, z: oz } = lastRotateAngles;
  return ox !== x || oy !== y || oz !== z;
};

let mat = new THREE.Matrix4();
let euler = new THREE.Euler();
export const controlChangeHandler = (camera) => {
  mat.copy(camera.matrix).invert();
  // mat.getInverse(camera.matrix);
  euler.setFromRotationMatrix(mat);
  const x = Math.round((euler.x / Math.PI) * 180);
  const y = Math.round((euler.y / Math.PI) * 180);
  const z = Math.round((euler.z / Math.PI) * 180);

  const lr = calcLAOorRAO(z);
  const cc = calcCranialorCaudal(x);

  const needFire = needExecuteCallback(x, y, z);
  if (needFire) {
    lastRotateAngles.x = x;
    lastRotateAngles.y = y;
    lastRotateAngles.z = z;

    return {
      mat,
      angle: { x, y, z },
      direction: { vertical: cc, horizontal: lr },
    };
  }

  return {
    mat,
  };
};
