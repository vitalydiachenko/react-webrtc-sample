const common = require('./webpack.common');
const merge = require('webpack-merge');

module.exports = merge(common, {
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './public',
    historyApiFallback: true,
    port: process.env.PORT || 3000,
    host: process.env.HOST || '0.0.0.0',
    disableHostCheck: true,
  },
  mode: 'development',
});
