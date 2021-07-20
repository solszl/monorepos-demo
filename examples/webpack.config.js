const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HappyPack = require("happypack");
const os = require("os");
const glob = require("glob");
const devServer = require("./serve.config");

const resolve = (dir) => {
  return path.resolve(__dirname, "..", dir);
};
const indexs = glob("examples/*/index.js", { sync: true });
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

const config = {
  target: "web",
  mode: "development",
  devtool: "cheap-module-eval-source-map",
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.js?$/,
        loader: "happypack/loader?id=happy-babel",
        include: [resolve("examples"), resolve("packages")],
      },
      {
        test: /\.worker\.js$/,
        use: {
          loader: "worker-loader",
          options: { inline: true, fallback: false },
        },
        include: [resolve("examples")],
      },
    ],
  },
  plugins: [
    new HappyPack({
      id: "happy-babel",
      loaders: [
        {
          loader: "babel-loader",
          options: {
            babelrc: true,
            cacheDirectory: true, // 启用缓存
          },
        },
      ],
      threadPool: HappyPack.ThreadPool({ size: os.cpus().length }),
    }),
    new webpack.DefinePlugin({
      "process.env": {
        BUILD_ENV: JSON.stringify(process.env.BUILD_ENV),
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
    ...htmlPlugins,
  ],
  devServer: devServer,
  node: { fs: "empty" },
  entry: {
    ...entries,
  },
};

module.exports = () => {
  return config;
};
