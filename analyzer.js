const webpack = require("webpack");
const webpackBundleAnalyzer = require("webpack-bundle-analyzer");
const BundleAnalyzerPlugin = webpackBundleAnalyzer.BundleAnalyzerPlugin;

const webpackConfigProd = require("react-scripts/config/webpack.config")(
  "production"
);

webpackConfigProd.plugins.push(new BundleAnalyzerPlugin());

webpack(webpackConfigProd, (err, stats) => {
  if (err || stats.hasErrors()) {
    console.error(err);
  }
});
