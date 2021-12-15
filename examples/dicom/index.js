import { Resource } from "@pkg/loader/src";
const seriesId = "1.2.392.200036.9116.2.1796265406.1637200042.8.1201900001.2";
const fs = "http://10.0.70.3:8000";

const resource = new Resource();

const fetchData = async (seriesId) => {
  const url = `/api/v1/series/${seriesId}`;
  const json = await (await fetch(url)).json();

  return json;
};

fetchData(seriesId).then(async (json) => {
  const imageUrls = json.data.images.map((i) => {
    return `${fs}/${i.storagePath}`;
  });

  const mode = "web";
  await resource.initTransfer([{ mode }]);
  const transfer = resource.getTransfer(mode);
  transfer.addItemUrls(seriesId, imageUrls, "axial");

  setTimeout(async () => {
    let cacheItem1 = await transfer.getImage(seriesId, 10, "axial");

    console.log(cacheItem1.allTags);
  }, 2000);
});
