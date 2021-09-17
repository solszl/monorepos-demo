const path = require("path");
const glob = require("glob");
const HtmlWebpackPlugin = require("html-webpack-plugin");

function resolve(dir) {
  return path.resolve(__dirname, "..", dir);
}

const isProd = process.env.NODE_ENV === "production";

function getEntries() {
  let indexs = glob("examples/*/index.js", { sync: true });
  const htmlPlugins = [];
  const entries = indexs.reduce((ret, file) => {
    const [, entry] = file.split("/");
    ret[`examples/${entry}`] = resolve(file);
    htmlPlugins.push(
      new HtmlWebpackPlugin({
        template: resolve(`examples/${entry}/index.html`),
        filename: `${entry}/index.html`,
        inject: "body",
        minify: true,
        chunks: [`examples/${entry}`],
      })
    );
    return ret;
  }, {});
  return { entries, htmlPlugins };
}

module.exports = {
  resolve,
  isProd,
  getEntries,
};
