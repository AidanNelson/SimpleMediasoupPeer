const path = require("path");

// Export array of configs for dual-format output
module.exports = [
  // UMD build for vanilla JS (script tags, global variable)
  {
    entry: "./index.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "SimpleMediasoupPeer.js",
      globalObject: "this",
      library: {
        name: "SimpleMediasoupPeer",
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
  },
  // ES Module build for modern build systems (React, Vue, etc.)
  {
    entry: "./index.js",
    experiments: {
      outputModule: true,
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "SimpleMediasoupPeer.esm.js",
      library: {
        type: "module",
      },
    },
  },
];
