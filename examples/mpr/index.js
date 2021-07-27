import { Plane } from "@saga/viewer";
const axisRoot = document.querySelector("#axis");
const coronalRoot = document.querySelector("#coronal");
const sagittalRoot = document.querySelector("#sagittal");

let p = [1, -2, 0];
let q = [3, 1, 4];
let r = [0, -1, 2];
let plane = new Plane();
plane.makeFrom3Points(p, q, r);

let volume = new Volume();
