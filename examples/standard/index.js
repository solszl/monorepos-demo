import { ToolsMisc, ViewportManager } from "@pkg/entry/src";
import { Resource } from "@pkg/loader/src";
import Centerline2D from "../../packages/bizz/tools/centerline/centerline-2d";
import Segment from "../../packages/bizz/tools/segments/segment";
import Tag from "../../packages/bizz/tools/tag/tag";
import Vernier from "../../packages/bizz/tools/vernier/vernier";
const { roi } = ToolsMisc;
const seriesId = "1.2.840.113619.2.404.3.1074448704.467.1622952070.403.6";
const fs = "http://172.16.6.14:8000";
let currentIndex = 50;
const API_GRAY = "/api/v1/series/";
const API_COLOR = "/api/v1/series/ssr/";

const vm = new ViewportManager();
vm.resource = new Resource();

const standard = vm.addViewport({
  plane: "standard",
  renderer: "canvas",
  alias: "axial",
  transferMode: "web",
  el: document.querySelector("#root"),
});

const fetchData = async (seriesId) => {
  const url = `${API_GRAY}${seriesId}`;
  const json = await (await fetch(url)).json();
  return json;
};

fetchData(seriesId).then(async (json) => {
  const imageUrls = json.data.images.map((i) => {
    return `${fs}/${i.storagePath}`;
  });

  const resource = vm.resource;
  await resource.initTransfer([{ mode: "web" }]);
  const { transferMode, alias } = standard.option;
  const transfer = resource.getTransfer(transferMode);
  transfer.addItemUrls(seriesId, imageUrls, alias);

  setTimeout(async () => {
    const image = await transfer.getImage(seriesId, currentIndex, alias);
    standard.imageView.showImage(image);
  }, 0);

  standard.on("slice_changed", () => {
    // [x]: remove me
    setTimeout(() => {
      const layer = viewport.toolView.stage.findOne("#toolsLayer");
      // let triangle = new Triangle({});
      let vernier = new Vernier({ count: 2, offset: 3, dragMode: 3 });

      // vernier.position({ x: 300, y: 400 });
      // prettier-ignore
      const testData = [
        [ 224.55, 250.15 ], [ 225.04, 250.17 ], [ 224.25, 248.94 ], [ 226.91, 244.28 ],
        [ 231.26, 243.71 ], [ 232.93, 241.92 ], [ 233.42, 238.6 ],  [ 234.94, 236.1 ],
        [ 238.89, 235.91 ], [ 244.3, 232.63 ],  [ 250.7, 225.44 ],  [ 259.69, 219.76 ],
        [ 262.47, 215.5 ],  [ 266.28, 214.74 ], [ 268.98, 212.11 ], [ 271.38, 206.19 ],
        [ 271.17, 204.74 ], [ 273.57, 201.82 ], [ 272.18, 195.55 ], [ 273.09, 192.22 ],
        [ 274.42, 190.7 ],  [ 277.15, 189.43 ], [ 278.89, 187.1 ],  [ 280.48, 181.32 ],
        [ 283.69, 180.06 ], [ 286.28, 177.77 ], [ 286.89, 172.23 ], [ 290.06, 169.23 ],
        [ 292.36, 159.6 ],  [ 296.8, 155.71 ],  [ 303.26, 155.17 ], [ 307.95, 153.43 ],
        [ 309.88, 153.79 ], [ 311.27, 152.34 ], [ 314.95, 151.37 ], [ 321.57, 143.59 ],
        [ 324.36, 142.36 ], [ 326.31, 139.58 ], [ 328.76, 139.29 ], [ 330.56, 137.55 ],
        [ 341.83, 139.88 ], [ 347.48, 138.23 ], [ 365.12, 138.72 ], [ 369.77, 137.9 ],
        [ 375.88, 138.6 ],  [ 387.64, 142.49 ], [ 391.67, 139.44 ], [ 400.86, 139.59 ],
        [ 405.4, 141.42 ],  [ 409.12, 141.15 ], [ 410.36, 140.23 ], [ 414.91, 139.63 ],
        [ 421, 134.55 ],    [ 423.38, 130.94 ], [ 427.59, 127.43 ], [ 434.08, 124.48 ],
        [ 435.4, 122.93 ],  [ 437.9, 121.93 ],  [ 439.57, 119.76 ], [ 454.79, 115.31 ],
        [ 460.89, 112.23 ], [ 470.22, 110.76 ], [ 474.8, 107.92 ],  [ 481.18, 108.21 ],
        [ 486.07, 106.84 ], [ 487.64, 108.71 ], [ 489.59, 109.47 ], [ 494.41, 109.1 ],
        [ 504.69, 119.63 ], [ 508.21, 119.83 ], [ 512.63, 122.26 ], [ 518.58, 120.89 ],
        [ 522.1, 123.68 ],  [ 523.95, 126.75 ], [ 526.88, 127.95 ], [ 529.53, 127.85 ],
        [ 530.85, 129.45 ], [ 530.78, 132.48 ], [ 533.9, 137.9 ],   [ 534.16, 140.78 ],
        [ 536.52, 144.39 ], [ 539.19, 145.48 ], [ 539.68, 147.36 ], [ 544.02, 148.52 ],
        [ 551.72, 147.32 ], [ 555.42, 148.71 ], [ 559.45, 148.5 ],  [ 562.04, 149.75 ],
        [ 567.88, 148.98 ], [ 575.14, 157.13 ], [ 580.49, 158.12 ], [ 592.45, 158.19 ],
        [ 603.72, 156.96 ], [ 606.45, 157.68 ], [ 608.11, 157.32 ], [ 617.9, 160.03 ],
        [ 619.67, 164.75 ], [ 621.98, 167 ],    [ 622.01, 171.23 ], [ 623.59, 173.17 ],
      ]
      vernier.path = testData;
      vernier.currentIndex = 0;
      layer.add(vernier);

      let centerline2d = new Centerline2D();
      layer.add(centerline2d);
      centerline2d.path = testData;

      let tag = new Tag();
      tag.position({
        x: 435.4,
        y: 122.93,
      });
      layer.add(tag);

      const segData = [
        { label: "helloaaaaaaaaaaaaaaaaaa", points: [[], [], [], []] },
        { label: "work123123", points: [[], [], [], [], [], [], [], []] },
        { label: "vanilla", points: [[], [], [], [], [], []] },
      ];
      let segment = new Segment();
      segment.width(400);
      segment.setData(segData);
      segment.setPosition({ y: 100 });
      segment.setDirection("landscape1");
      layer.add(segment);

      let i = 0;
      setInterval(() => {
        i += 1;
        i %= testData.length;
        vernier.currentIndex = i;
      }, 100);
    }, 50);
  });
});

document.addEventListener("wheel", async (e) => {
  let offset = Math.sign(e.wheelDelta);
  currentIndex += offset;
  // const { resource } = vm;
  // const { transferMode, alias } = standard.option;
  // const transfer = resource.getTransfer(transferMode);
  // const image = await transfer.getImage(seriesId, currentIndex, alias);
  // standard.imageView.showImage(image);
  standard.showImage(seriesId, currentIndex);
});

// standard.useTool("length");

// standard.on(ViewportEvents.TOOL_DATA_UPDATED, (info) => {
//   const image = standard.imageView.image;
//   const { data } = info;
//   const result = roi(image, data);
//   console.log(result, standard);
// });

window.viewport = standard;
