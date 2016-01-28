const webpack = require("webpack");
const path = require("path");
const config = require("./webpack.client.base.config");

config.node = {
  constants: "empty",
  fs: "empty"
};

config.resolve.root.push(
  path.resolve("./tests"),
  path.resolve("./app")
);

config.output = {
  filename: "[name]-bundle.js",
  path: "tests/tmp"
};

config.entry.tests = "./tests/runner";

config.module.loaders.unshift({
  test: /-test\.jsx?$/,
  loader: "mocha"
});
config.module.loaders.push({
  test: /jquery\.js$/,
  loader: "expose?jQuery"
});
config.module.loaders.push({
  test: /jquery\.js$/,
  loader: "expose?$"
});

config.module.noParse.push(/node_modules\/sinon/);

config.devtool = "eval-source-map";

module.exports = config;
