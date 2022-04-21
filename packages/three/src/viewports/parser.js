import * as THREE from "three";
import vtkXMLPolyDataReader from "vtk.js/Sources/IO/XML/XMLPolyDataReader";

class Parser {
  constructor() {}

  async parseSingleLabel(arrayBuffer) {
    const reader = vtkXMLPolyDataReader.newInstance();
    reader.parseAsArrayBuffer(arrayBuffer);

    const polydata = reader.getOutputData(0);
    const vertices = polydata.getPoints().getData();

    const tris = polydata.getPolys().getData();
    const indices = new Uint32Array(polydata.getPolys().getNumberOfCells() * 3);
    let i = 0;
    let j = 0;
    while (j < indices.length) {
      indices[j++] = tris[++i];
      indices[j++] = tris[++i];
      indices[j++] = tris[++i];
      ++i;
    }

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    geometry.computeVertexNormals();

    if (polydata.getCellData().getArrayByName("Scalars_")) {
      const labels = polydata.getCellData().getArrayByName("Scalars_").getData();
      geometry.setAttribute("label", new THREE.BufferAttribute(labels, 1));
    }

    geometry.computeBoundingSphere();

    return [geometry];
  }

  async parseMultiLabel(arrayBuffer) {
    const reader = vtkXMLPolyDataReader.newInstance();
    reader.parseAsArrayBuffer(arrayBuffer);

    const polydata = reader.getOutputData(0);
    polydata.buildCells();

    const allVertices = polydata.getPoints().getData();
    const allScalars = polydata.getCellData().getScalars().getData();

    const calcCount = (data) => {
      return data.reduce(function (time, name) {
        if (name in time) {
          time[name]++;
        } else {
          time[name] = 1;
        }
        return time;
      }, {});
    };

    const space = calcCount(allScalars);
    this.verticesMap = new Map();
    this.indicesMap = new Map();

    let geometriesMap = new Map();

    const allocSize = (obj) => {
      Object.entries(obj).forEach(([key, value]) => {
        this.verticesMap.set(~~key, []);
        this.indicesMap.set(~~key, []);
      });
    };

    allocSize(space);
    // console.time('build scalars.');
    allScalars.forEach((value, index) => {
      const { cellPointIds } = polydata.getCellPoints(index);
      this._appendVertices(value, cellPointIds, allVertices);
      this._appendIndices(value);
    });
    // console.timeEnd('build scalars.');

    // console.time('build geometry.');
    for await (const [key, value] of this.indicesMap.entries()) {
      let geometry = new THREE.BufferGeometry();
      const vertices = this.verticesMap.get(key);
      geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(vertices), 3));
      geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(value), 1));
      geometry.computeVertexNormals();
      geometry.userData.id = key;
      geometry.computeBoundingSphere();
      geometriesMap.set(key, geometry);
    }

    // console.timeEnd('build geometry.');

    this.verticesMap.clear();
    this.indicesMap.clear();
    return geometriesMap.values();
  }

  _appendVertices(scalars, cellPointIds, allVertices) {
    let data = this.verticesMap.get(scalars);

    cellPointIds.forEach((id) => {
      data.push(allVertices[id * 3]);
      data.push(allVertices[id * 3 + 1]);
      data.push(allVertices[id * 3 + 2]);
    });

    this.verticesMap.set(scalars, data);
  }

  _appendIndices(scalars) {
    let data = this.indicesMap.get(scalars);
    const length = data.length;
    data.push(length);
    data.push(length + 1);
    data.push(length + 2);
    this.indicesMap.set(scalars, data);
  }

  async _delay(ms, value) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms, value);
    });
  }

  async parse(arrayBuffer, isMulti = true) {
    if (isMulti) {
      return this.parseMultiLabel(arrayBuffer);
    } else {
      return this.parseSingleLabel(arrayBuffer);
    }
  }
}

export default Parser;
