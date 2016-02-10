const webpack = require("webpack");
const path = require("path");

const devBuild = process.env.NODE_ENV !== "production";
const nodeEnv = devBuild ? "development" : "production";

module.exports = {
  context: __dirname,

  entry: {

    // See use of 'vendor' in the CommonsChunkPlugin inclusion below.
    vendor: [
      "babel-polyfill",
      "jquery",
      "react",
      "react-dom"
    ],
  },
  resolve: {
    extensions: ["", ".js", ".jsx"],
    root: [path.resolve("./vendor")]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(nodeEnv),
      },
    }),

    // https://webpack.github.io/docs/list-of-plugins.html#2-explicit-vendor-chunk
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      filename: "vendor-bundle.js",
      // Passing Infinity just creates the commons chunk, but moves no modules into it.
      // In other words, we only put what's in the vendor entry definition in vendor-bundle.js
      minChunks: Infinity,
    }),
  ],
  module: {
    loaders: [

      // Not all apps require jQuery. Many Rails apps do, such as those using TurboLinks or bootstrap js
      // { test: require.resolve("jquery"), loader: "expose?jQuery" },
      { test: require.resolve("jquery"), loader: "expose?$" },
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: [/node_modules/]
      },
      {
        test: require.resolve("react"),
        loader: "expose?React"
      },
      {
        test: require.resolve("react-dom"),
        loader: "expose?ReactDOM"
      }
    ],
    noParse: []
  },
};
