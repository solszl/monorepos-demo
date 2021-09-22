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

const getValue = (dataset, tag, length) => {
  if (length < 128) {
    if (length === 2) {
      return dataset.uint16(tag);
    } else if (length === 4) {
      return dataset.uint32(tag);
    }

    const str = dataset.string(tag);
    if (isASCII(str)) {
      if (str !== undefined) {
        return str;
      }
    } else {
      if (length !== 2 && length !== 4) {
        return "binary data";
      }
    }

    if (length === 0) {
      return "";
    }
  } else {
    return "data too long to show.";
  }
};

export const dump = (dataset) => {
  const dumpObj = {};
  try {
    for (const propertyName in dataset.elements) {
      const element = dataset.elements[propertyName];
      const { tag, vr, length } = element;
      const attr = AllTags[tag] ?? ExternalTags[tag] ?? "Unknown";
      dumpObj[tag.toLocaleLowerCase()] = {
        tag,
        vr,
        length,
        attr,
        value: getValue(dataset, tag, length),
      };

      if (attr === "Unknown") {
        // console.log("dump unknown key", tag);
      }
    }
  } catch (err) {
    console.error("dump error", err);
  }

  return dumpObj;
};
