import { Loader, Resource } from "@saga/loader";
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
  resource.addItemUrls(seriesId, imageUrls, "cpr-lm");
  resource.addItemUrls(seriesId, imageUrls, "lumen-lm");

  setTimeout(async () => {
    const tmp = Array.from(new Array(20), (_, i) => i + 1);
    for (const i of tmp) {
      const ii = await resource.getImage(seriesId, i, "cpr-lm");
      console.log(ii);
    }
  }, 500);

  setTimeout(async () => {
    const tmp = Array.from(new Array(20), (_, i) => i + 1);
    for (const i of tmp) {
      const ii = await resource.getImage(seriesId, i, "axis");
      console.log(ii);
    }
  }, 500);
  console.log(resource);

  // await aaa(seriesId, 0, "axis");
  // await aaa(seriesId, 0, "cpr");
  // await aaa(seriesId, 0, "lumen-lm");
  // await aaa(seriesId, 0, "vmip");
});

const aaa = async (seriesId, index, plane) => {};
