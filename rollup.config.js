import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
// import lernaGetPackages from "lerna-get-packages";
import path from "path";
import commonjs from "rollup-plugin-commonjs";
import { uglify } from "rollup-plugin-uglify";

const { LERNA_PACKAGE_NAME, LERNA_ROOT_PATH } = process.env;
const PACKAGE_ROOT_PATH = process.cwd();
const INPUT_FILE = path.join(PACKAGE_ROOT_PATH, "packages/entry/src/index.js");
const OUTPUT_DIR = path.join(PACKAGE_ROOT_PATH, "dist");
const PKG_JSON = require(path.join(PACKAGE_ROOT_PATH, "package.json"));
const IS_BROWSER_BUNDLE = !!PKG_JSON.browser;

// const ALL_MODULES = lernaGetPackages(LERNA_ROOT_PATH).map(({ package: { name } }) => name);

const mirror = (array) => array.reduce((acc, val) => ({ ...acc, [val]: val }), {});

const formats = IS_BROWSER_BUNDLE ? ["umd"] : ["es", "cjs"];

export default formats.map((format) => ({
  plugins: [resolve(), json(), commonjs(), uglify()],
  input: INPUT_FILE,
  // IS_BROWSER_BUNDLE ? mirror(ALL_MODULES) : undefined,
  // external: IS_BROWSER_BUNDLE ? undefined : ALL_MODULES,
  // name: LERNA_PACKAGE_NAME,
  output: {
    file: path.join(OUTPUT_DIR, `index.${format}.js`),
    format,
    name: "saga",
    globals: { crypto: "crypto" },
    sourcemap: true,
    amd: {
      id: LERNA_PACKAGE_NAME,
    },
  },
}));
