const path = require("path");

// ES Module build for modern build systems (React, Vue, etc.)
module.exports = {
  entry: "./index.js",
  experiments: {
    outputModule: true,
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "SimpleMediasoupPeer.js",
    library: {
      type: "module",
    },
  },
  optimization: {
    minimize: false,
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
