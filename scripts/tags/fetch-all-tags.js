const http = require("http");
const cheerio = require("cheerio");
const fs = require("fs");
// const URL = "http://dicom.nema.org/medical/dicom/current/output/html/part06.html";
// const URL = "http://127.0.0.1:8887/PS3.6.html";
// https://climserv.ipsl.polytechnique.fr/documentation/idl_help/DICOM_Attributes.html
const URL = "http://127.0.0.1:8887/tags/DICOM_Attributes.html";
const get = async (url) => {
  return new Promise((resolve, reject) => {
    http
      .get(URL, function (res) {
        let html = ""; //用来存储请求网页的整个html内容
        res.setEncoding("utf-8"); //防止中文乱码
        //监听data事件，每次取一块数据
        res.on("data", function (chunk) {
          html += chunk;
        });
        //监听end事件，如果整个网页内容的html都获取完毕，就执行回调函数
        res.on("end", function () {
          resolve(html);
        });
      })
      .on("error", function (err) {
        console.log(err);
        reject(err);
      });
  });
};
const main = async () => {
  const data = await get(URL);
  const $ = cheerio.load(data);

  const find = (elm, selectors, reg) => {
    let value = "";
    selectors.forEach((selector) => {
      const v = $(elm).find(selector).text().trim().replace(reg, "");

      if (v !== "") {
        value = v;
      }
    });

    return value;
  };

  // (0018,0060) => x00180060
  const makeTag = (tag) => {
    return "x" + tag.substr(1, 9).replace(",", "");
  };

  let dictionary = {};
  // 这解析后的数据太大了。700K+ .舍弃
  // $("body > div > div:nth-child(12) > div.table > div > table > tbody")
  //   .find("tr")
  //   .each(function (i, elm) {
  //     const children = $(elm).children().toArray();
  //     const obj = {};
  //     const tag = find(children[0], ["td > p > span", "td > p"]);
  //     const key = makeTag(tag);
  //     obj.attr = find(children[2], ["td > p > span", "td > p"], /[\u200B-\u200D\uFEFF]/g);
  //     obj.vr = find(children[3], ["td > p > span", "td > p"]);
  //     dictionary[key] = obj;
  //   });

  $("#wp1023106table1008827 > tbody")
    .find("tr")
    .slice(1)
    .each(function (i, elm) {
      const children = $(elm).children().toArray();
      const tag = makeTag($(children[2]).find("td > center").text().trim());
      const vr = $(children[1]).find("td > center > a").text().trim();
      const attr = $(children[0]).find("td > div").text().trim().replace(/ /g, "");
      // 可能存在 “OW or OB”
      if (vr.length <= 8) {
        // 用对象的话，存到本地需要额外的key  用数组从80K减少到70K,ZIP后，约16K，即sdk增大体积16K
        // dictionary[tag] = { vr, attr };
        // dictionary[tag] = [vr, attr];
        dictionary[tag.toLocaleLowerCase()] = attr;
      }
    });

  console.log("一共解析了", Object.keys(dictionary).length);
  fs.writeFile("./scripts/tags/dictionary.json", JSON.stringify(dictionary), (error) => {
    if (error) {
      console.log(error);
    }

    console.log("ok.");
  });
};
main();
