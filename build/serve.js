const { resolve } = require("./tools");
const serve = {
  port: 13333,
  open: true,
  host: "0.0.0.0",
  static: {
    directory: "examples",
  },
  historyApiFallback: true,
  client: {
    overlay: true,
    logging: "none",
    progress: false,
  },
  proxy: {
    "/api": {
      target: "http://192.168.111.115:13000",
      changeOrigin: true,
      pathRewrite: {
        "^/api": "",
      },
    },
    "/ct_chest/api": {
      target: "http://192.168.109.92:13000",
      changeOrigin: true,
      pathRewrite: {
        "^/api": "",
      },
    },
  },
};

module.exports = { serve };
