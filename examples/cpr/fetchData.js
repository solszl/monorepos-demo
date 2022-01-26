const fs = "http://10.0.70.3:8000";

export const fetchDicom = async (seriesId) => {
  const url = `/api/v1/series/${seriesId}`;
  const json = await (await fetch(url)).json();
  const imageUrls = json.data.images.map((i) => {
    return `${fs}/${i.storagePath}`;
  });

  return imageUrls;
};

export const fetchTreeLines = async (seriesId) => {
  const url = `/api/v1/predict/${seriesId}/ct_heart`;
  const json = await (await fetch(url)).json();
  // 怎么这么多层。。。
  const treeLines = json.data.heart.arteryCoronary.treeLines.data;
  return treeLines;
};
