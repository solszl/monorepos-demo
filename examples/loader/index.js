import { Loader } from "@saga/loader";
const seriesId = "1.3.46.670589.33.1.63758074643606917200002.5725553829146337340";
const fs = "http://192.168.111.115:8000";

const fetchData = async (seriesId) => {
  const url = `/api/v1/series/${seriesId}`;
  const json = await (await fetch(url)).json();
  return json;
};

fetchData(seriesId).then((json) => {
  const imageUrls = json.data.images.map((i) => {
    return `${fs}/${i.storagePath}`;
  });

  const urls = imageUrls.slice(0, 2);
  console.log(urls);
});

console.log(Loader);
