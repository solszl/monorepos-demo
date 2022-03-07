import { createImage } from "@pkg/dicom/src";
import { ViewportManager } from "@pkg/entry/src";
import { Resource } from "@pkg/loader/src";

const vm = new ViewportManager();
vm.resource = new Resource();

const standard = vm.addViewport({
  plane: "standard",
  renderer: "canvas",
  alias: "axial",
  transferMode: "web",
  el: document.querySelector("#root"),
});

const ulEl = document.getElementById("properties");
const dragEl = document.getElementById("root");
const tiEl = document.getElementById("tiTag");
dragEl.addEventListener("dragenter", (e) => {
  console.log("dragenter");
  e.preventDefault();
});
dragEl.addEventListener("dragover", (e) => {
  e.preventDefault();
});
dragEl.addEventListener("drop", (e) => {
  e.preventDefault();
  console.log("drop");
  // inputFile.click();
  console.log(e.dataTransfer.files);
  const file = e.dataTransfer.files[0];
  const fileReader = new FileReader();
  fileReader.onload = async (e) => {
    const arrayBuffer = e.target.result;
    const image = await createImage(arrayBuffer);
    standard.imageView.showImage(image);

    const { allTags } = image;
    console.log(allTags);

    ulEl.innerHTML = "";

    Object.entries(allTags).forEach(([key, tag]) => {
      const domStr = `<li ">
        <div style="display:flex;" id=${key}>
          <div style="width:90px;">${tag.tag}</div>
          <div style="width:225px;">${tag.attr}</div>
          <div>${tag.value}</div>
        </div>
      </li>`;
      const el = new DOMParser().parseFromString(domStr, "text/html").querySelector("li");
      ulEl.appendChild(el);
    });
  };
  fileReader.readAsArrayBuffer(file);
});

let tempA = document.createElement("a");
tiEl.addEventListener("keyup", (e) => {
  if (e.code === "Enter") {
    tempA.href = `#${tiEl.value}`;
    tempA.click();

    const lis = document.querySelectorAll("li");
    lis.forEach((li) => {
      li.classList.remove("searched");
    });

    const li = document.querySelector(`#${tiEl.value}`).parentNode;
    li.classList.add("searched");
  }
});
