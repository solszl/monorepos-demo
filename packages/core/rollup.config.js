import serve from "rollup-plugin-serve";
import babel from "rollup-plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";

import path from "path";

export default {
  input: path.join(__dirname, "/src/core.js"),
  output: {
    file: path.join(__dirname, "dist/dest.js"),
    name: "Core",
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
    serve({
      open: true,
      openPage: "./index.html",
      contentBase: [__dirname, ""],
    }),
  ],
};
