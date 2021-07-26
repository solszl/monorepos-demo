import { Resource } from "@saga/loader";
const seriesId = "1.3.46.670589.33.1.63758074643606917200002.5725553829146337340";
const fs = "http://192.168.111.115:8000";

const resource = new Resource();
const fetchData = async (seriesId) => {
  const url = `/api/v1/series/${seriesId}`;
  const json = await (await fetch(url)).json();

  return json;
};

fetchData(seriesId).then((json) => {
  const imageUrls = json.data.images.map((i) => {
    return `${fs}/${i.storagePath}`;
  });

  resource.addItemUrls(seriesId, imageUrls, "axis");

  setTimeout(async () => {
    const data = [1, 2];
    data.forEach(async (i) => {
      resource.getImage(seriesId, i, "axis");
    });
  }, 500);

  setTimeout(async () => {
    let cacheItem = await resource.getImage(seriesId, 10, "axis");
    console.log(cacheItem);
  }, 2000);
  console.log(resource);
});
