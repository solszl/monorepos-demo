const {
  HotModuleReplacementPlugin,
  container: { ModuleFederationPlugin },
} = require("webpack");
const { merge } = require("webpack-merge");
const { devServer } = require("./config");
const { getEntries } = require("./tools");
const { resolve } = require("./tools");
const baseConfig = require("./webpack.base.conf");

const { entries, htmlPlugins } = getEntries();

const devConfig = {
  entry: {
    ...entries,
  },
  module: {
    rules: [
      // {
      //   test: /\.js$/,
      //   use: {
      //     loader: "eslint-loader",
      //     options: {
      //       formatter: require("eslint-friendly-formatter"),
      //     },
      //   },
      //   include: [resolve("packages"), resolve("examples")],
      //   enforce: "pre",
      // },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HotModuleReplacementPlugin(),
    new ModuleFederationPlugin({
      name: "SDK",
      filename: "sdkEntry.js",
      exposes: {
        "./Entry": resolve("packages/entry/src/index.js"),
      },
    }),
    ...htmlPlugins,
  ],
  devServer: devServer,
};

module.exports = merge(baseConfig, devConfig);
