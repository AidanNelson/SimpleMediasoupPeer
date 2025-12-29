import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ES Module build for modern build systems (React, Vue, etc.)
export default {
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
  devServer: {
    hot: false,
    liveReload: true,
    port: 9000,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
};
