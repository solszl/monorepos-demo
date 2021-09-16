import { getBabelOutputPlugin } from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import path from "path";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import worker from "rollup-plugin-web-worker-loader";

const PACKAGE_ROOT_PATH = process.cwd();
const INPUT_FILE = path.resolve(PACKAGE_ROOT_PATH, "src/index.js");
const OUTPUT_DIR = path.join(PACKAGE_ROOT_PATH, "lib");
console.log(INPUT_FILE);
const formats = ["esm"];

export default formats.map((format) => ({
  plugins: [
    peerDepsExternal({
      includeDependencies: false,
    }),
    resolve({
      browser: true,
    }),
    json({ compact: true }),
    commonjs({
      sourceMap: false,
    }),
    worker({
      allowAllFormats: true,
    }),
    getBabelOutputPlugin({
      babelrc: false,
      presets: [
        [
          "@babel/preset-env",
          {
            corejs: 2,
            useBuiltIns: "usage",
            modules: "umd",
          },
        ],
      ],
      plugins: [
        ["@babel/plugin-transform-runtime", { corejs: 2 }],
        "@babel/plugin-proposal-export-default-from", // Stage 1
        "@babel/plugin-proposal-logical-assignment-operators",
        ["@babel/plugin-proposal-optional-chaining", { loose: false }],
        ["@babel/plugin-proposal-pipeline-operator", { proposal: "minimal" }],
        ["@babel/plugin-proposal-nullish-coalescing-operator", { loose: false }],
        "@babel/plugin-proposal-do-expressions",
        ["@babel/plugin-proposal-decorators", { legacy: true }], // Stage 2
        "@babel/plugin-proposal-function-sent",
        "@babel/plugin-proposal-export-namespace-from",
        "@babel/plugin-proposal-numeric-separator",
        "@babel/plugin-proposal-throw-expressions",
        "@babel/plugin-syntax-dynamic-import", // Stage 3
        "@babel/plugin-syntax-import-meta",
        ["@babel/plugin-proposal-class-properties", { loose: false }],
        "@babel/plugin-proposal-json-strings",
        "@babel/plugin-proposal-object-rest-spread",
      ],
    }),
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
