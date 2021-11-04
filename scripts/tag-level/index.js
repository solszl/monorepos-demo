const cheerio = require("cheerio");
const TAG = "0028,0030";

const payload = {
  from: 0,
  size: 15,
  query: {
    match: {
      _all: TAG.toUpperCase(),
    },
  },
};

const child_process = require("child_process");
const curl = `curl https://search.dicom.innolitics.com/_search/ -k -H "Content-Type: application/json" -X POST -d '${JSON.stringify(
  payload
)}'`;

// console.log(curl);
child_process.exec(curl, (err, stdout, stderr) => {
  let data = JSON.parse(stdout);
  let obj = data.hits.hits.filter((hit) => {
    const { _source } = hit;
    if (_source.node.includes("ct-image")) {
      return hit;
    }
  })[0];

  console.log(`在ct-image类下搜索 (${TAG})`);
  if (!obj) {
    console.log("No results found. 如果还觉得有一线希望，参考 ./scripts/tags/DICOM_Attributes_Full_List.html");
    return;
  }

  const HOST = "https://dicom.innolitics.com/ciods/";
  let uri = obj._source.node.join("/");
  let url = `${HOST}${uri}`;
  const curl = `curl ${url} -k -H "Content-Type: text/html"`;

  // console.log(curl);
  child_process.exec(curl, (err, stdout, stderr) => {
    const $ = cheerio.load(stdout);
    const text = $(
      "#root > div > div > div.pane-container > div.pane-secondary > div.pane-content > div > div:nth-child(1) > div.m-a-1.detail-pane-section > table > tbody > tr:nth-child(2) > td"
    )
      .text()
      .trim();

    const typeMap = {
      "Optional (3)": "可选",
      "Required (1)": "必须",
      "Conditionally Required": `存在必要tag, 如果已知必要tag，可以添加。如果不知。可以访问 ${url} 查看`,
      "Empty if Unknown": "需要，但是如果值为空的话，可以空着",
    };

    const find = (type) => {
      let result = `未搜索到相关tag信息，${type}`;
      Object.keys(typeMap).map((key) => {
        if (type.includes(key)) {
          result = typeMap[key];
        }
      });

      return result;
    };

    console.log(`Tag: (${TAG}) 的值类型为${text}, 建议处理方式为 ${find(text)}`);
  });
});
