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
      target: "http://172.16.3.35:8000",
      changeOrigin: true,
      pathRewrite: {
        // "^/api": "",
      },
    },
  },
};

module.exports = { serve };
