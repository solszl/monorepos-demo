export const API_METHOD = {
  tag: "coronary.tag",
  plane: (plane) => {
    return PLANE_METHOD[plane];
  },
};

export const PLANE_METHOD = {
  axial: "coronary.dicom.axial",
  sagittal: "coronary.dicom.sagittal",
  coronary: "coronary.dicom.coronary",
};
