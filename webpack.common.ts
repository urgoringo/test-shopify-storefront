import * as path from "path";
import * as webpack from "webpack";
import ESLintWebpackPlugin from "eslint-webpack-plugin";

const config: webpack.Configuration = {
  plugins: [
    new ESLintWebpackPlugin({
      extensions: ["ts", "tsx"],
      failOnWarning: true,
    }),
  ],
  entry: {
    "meal-boxes": "./src/index.tsx",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: [/node_modules/, /assets/],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: [/node_modules/, /assets/],
        use: ["babel-loader"],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: "file-loader",
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx"],
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "assets"),
    publicPath: "",
    sourceMapFilename: "[name].js.map",
  },
};

export default config;
