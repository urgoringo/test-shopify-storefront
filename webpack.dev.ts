import {merge} from "webpack-merge";
import common from "./webpack.common";
import {BundleAnalyzerPlugin} from "webpack-bundle-analyzer";

const config = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  watch: true,
  plugins: [new BundleAnalyzerPlugin()],
  optimization: {
    usedExports: true,
  },
});

export default config;
