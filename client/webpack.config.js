const path = require("path");

module.exports = {
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "SimpleMediasoupPeer.js",
    globalObject: "this",
    library: {
      type: "umd",
      umdNamedDefine: true,
    },
  },
  devServer: {
    hot: false,
    liveReload: true,
    port: 9000,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
};
