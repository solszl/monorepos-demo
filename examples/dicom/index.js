import { Resource } from "@pkg/loader/src";
const seriesId =
  "1.3.46.670589.33.1.63758074643606917200002.5725553829146337340";
const fs = "http://192.168.111.115:8000";

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
