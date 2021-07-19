import serve from "rollup-plugin-serve";
import babel from "rollup-plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import html from "@rollup/plugin-html";

import path from "path";

export default {
  input: "src/index.js",
  output: {
    file: "dist/dest.js",
    name: "Loader",
    format: "umd",
    sourcemap: "inline",
  },
  watch: {
    clearScreen: false,
  },
  plugins: [
    babel({ exclude: "node_modules/**", runtimeHelpers: true }),
    nodeResolve({ extensions: [".js"], browser: true }),
    commonjs(),
    html(),
    serve({
      open: true,
      openPage: "index.html",
      contentBase: ["dist"],
    }),
  ],
};
