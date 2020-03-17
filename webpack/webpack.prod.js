const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const common = require('./webpack.common');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CssChunksHtmlPlugin = require('css-chunks-html-webpack-plugin');
const DotEnvWebpack = require('dotenv-webpack');
const ExtractCssChunksPlugin = require("extract-css-chunks-webpack-plugin");
const merge = require('webpack-merge');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(common, {
  plugins: [
    new CleanWebpackPlugin(),
    new CssChunksHtmlPlugin({ inject: 'head' }),
    new DotEnvWebpack(),
    new ExtractCssChunksPlugin({
      filename: 'static/css/style.[hash:8].css'
    }),
    new TerserPlugin({
      sourceMap: false,
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, process.cwd(), 'public'),
        to: path.resolve(__dirname, process.cwd(), 'build'), ignore: ['index.html'] },
    ]),
  ],
  output: {
    filename: 'static/js/bundle.[hash:8].min.js',
    publicPath: '/',
    path: path.resolve(__dirname, process.cwd(), 'build'),
  },
  mode: 'production',
});
