import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import path from "path";
import { terser } from "rollup-plugin-terser";

const PACKAGE_ROOT_PATH = process.cwd();
const INPUT_FILE = path.join(PACKAGE_ROOT_PATH, "packages/entry/src/index.js");
const OUTPUT_DIR = path.join(PACKAGE_ROOT_PATH, "lib");

const formats = ["es", "cjs"];

export default formats.map((format) => ({
  plugins: [
    json(),
    resolve(),
    commonjs(),
    babel({
      babelHelpers: "runtime",
      babelrc: false,
      exclude: "node_modules/**",
      presets: [
        [
          "@babel/preset-env",
          {
            corejs: 2,
            useBuiltIns: "usage",
            targets: {
              chrome: 49,
            },
          },
        ],
      ],
    }),
    terser(),
  ],
  input: INPUT_FILE,
  output: {
    file: path.join(OUTPUT_DIR, `index.${format}.js`),
    format,
    name: "saga",
    sourcemap: true,
  },
}));

// esModule cjs
