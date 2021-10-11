const { serve } = require("./serve");

const config = {
  buildDetail: false,
  devServer: serve,
  development: {
    API_PATH: "/api",
  },
  test: {
    API_PATH: "/api",
  },
  production: {
    API_PATH: "/api",
  },
};
module.exports = config;
