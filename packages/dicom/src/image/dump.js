import AllTags from "./dictionary.json";
const ExtensionTags = {
  x00189305: "Revolution​Time",
  x00083010: "Irradiation​Event​UID",
  x00189306: "Single​Collimation​Width",
  x00189307: "Total​Collimation​Width",
  x00189309: "Table​Speed",
  x00189310: "Table​Feed​Per​Rotation",
  x00189311: "Spiral​Pitch​Factor",
  x00209241: "Nominal​Percentage​Of​Cardiac​Phase",
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
      const attr = AllTags[tag] ?? ExtensionTags[tag] ?? "Unknown";
      dumpObj[tag.toLocaleLowerCase()] = {
        tag,
        vr,
        length,
        attr,
        value: getValue(dataset, tag, length),
      };

      if (attr === "Unknown") {
        console.log("dump unknown key", tag);
      }
    }
  } catch (err) {
    console.error("dump error", err);
  }

  return dumpObj;
};
