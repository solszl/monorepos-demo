import AllTags from "./dictionary.json";
const ExternalTags = {
  x00189305: "RevolutionTime",
  x00083010: "IrradiationEventUID",
  x00189306: "SingleCollimationWidth",
  x00189307: "TotalCollimationWidth",
  x00189309: "TableSpeed",
  x00189310: "TableFeedPerRotation",
  x00189311: "SpiralPitchFactor",
  x00209241: "NominalPercentageOfCardiacPhase",
  x00189302: "AcquisitionType",
  x00189323: "ExposureModulationType",
  x00189324: "EstimatedDoseSaving",
  x00189345: "CTDIvol",
  x00189318: "ReconstructionTargetCenterPatient",
  x00189327: "TablePosition",
  x00189334: "FluoroscopyFlag",
  x00209056: "StackID",
  x00209057: "InStackPositionNumber",
  x00209128: "TemporalPositionIndex",
};

const isASCII = (str) => {
  return /^[\x00-\x7F]*$/.test(str);
};

const dumpDataSet = (dataSet, output) => {
  try {
    for (var propertyName in dataSet.elements) {
      var element = dataSet.elements[propertyName];

      const { vr, tag } = element;
      let obj = {};
      obj.tag = tag;
      obj.vr = vr;
      obj.length = element.length;
      if (element.hadUndefinedLength) {
        obj.length = -1;
      }
      const attr = AllTags[tag] ?? ExternalTags[tag] ?? "Unknown";
      obj.attr = attr;
      if (element.items) {
        obj.items = [];
        element.items.forEach((item) => {
          let out = {};
          const itemObj = {};
          dumpDataSet(item.dataSet, out);
          Object.assign(itemObj, out);
          obj.items.push(itemObj);
        });
      } else if (element.fragments) {
        element.fragments.forEach((fragment, index) => {
          let basicOffset;
          if (element.basicOffsetTable) {
            basicOffset = element.basicOffsetTable[index];
          }

          let value = `offset=${fragment.offset}(${basicOffset});length=${fragment.length}`;
        });
      } else {
        let value = "";
        if (element.length < 128) {
          // if (element.length === 2) {
          //   value += "(" + dataSet.uint16(propertyName) + ")";
          // } else if (element.length === 4) {
          //   value += "(" + dataSet.uint32(propertyName) + ")";
          // }

          var str = dataSet.string(propertyName);
          if (isASCII(str)) {
            if (str !== undefined) {
              value += `${str}`;
            }
          } else {
            if (element.length !== 2 && element.length !== 4) {
              value += "binary data";
            }
          }
        } else {
          value = "data too long to show.";
        }

        obj.value = value;
      }

      output[element.tag.toLocaleLowerCase()] = obj;
    }
  } catch (err) {
    console.error("dump error", err);
  }
};

export const dump = (dataset) => {
  const dumpObj = {};
  dumpDataSet(dataset, dumpObj);
  return dumpObj;
};
