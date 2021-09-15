import { Resource } from "@saga/loader";
const seriesId = "1.3.46.670589.33.1.63758074643606917200002.5725553829146337340";
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

  const urls = imageUrls.slice(0, 100);
  await resource.initTransfer([{ mode: "web" }]);
  const transfer = resource.getTransfer("web");
  transfer.addItemUrls(seriesId, urls, "axis");
  transfer.addItemUrls(seriesId, urls, "cpr-lm");
  transfer.addItemUrls(seriesId, urls, "lumen-lm");

  setTimeout(async () => {
    const ii = await transfer.getImage(seriesId, 10, "lumen-lm");
    console.log(ii);
  }, 500);

  // setTimeout(async () => {
  //   const tmp = Array.from(new Array(20), (_, i) => i + 1);
  //   for (const i of tmp) {
  //     const ii = await resource.getImage(seriesId, i, "axis");
  //     console.log(ii);
  //   }
  // }, 500);

  setTimeout(() => {
    // resource.loadSeries(seriesId, "lumen-lm");
  }, 3000);
  console.log(resource);
});
