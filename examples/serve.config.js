const path = require("path");
const devServer = {
  contentBase: path.resolve("./examples"),
  port: 13333,
  open: true,
  hot: true,
  host: "0.0.0.0",
  index: "index.html",
  overlay: {
    errors: true,
    warnings: true,
  },
  historyApiFallback: true,
  proxy: {
    "/ct_chest/api": {
      target: "http://192.168.109.92:3000",
      changeOrigin: true,
      pathRewrite: {
        "^/api": "",
      },
    },
  },
};

module.exports = devServer;
