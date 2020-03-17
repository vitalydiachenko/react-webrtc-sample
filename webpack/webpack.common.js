const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CssChunksHtmlPlugin = require('css-chunks-html-webpack-plugin');
const DotEnvWebpack = require('dotenv-webpack');
const ExtractCssChunksPlugin = require("extract-css-chunks-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: "./src/index.tsx",
  plugins: [
    new CleanWebpackPlugin(),
    new DotEnvWebpack(),
    new ExtractCssChunksPlugin({
      filename: 'static/css/style.[hash:8].css'
    }),
    new HtmlWebpackPlugin({
      template: 'public/index.html',
    }),
    new CssChunksHtmlPlugin({ inject: 'head' }),
  ],
  output: {
    filename: "static/js/bundle.[hash:7].js",
    publicPath: '/',
    path: path.join(process.cwd(), 'dist')
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
    modules: [
      path.resolve('./src'),
      path.resolve('./node_modules'),
    ]
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader"
      },
      {
        oneOf: [
          {
            test: /\.css$/,
            use: [
              { loader: ExtractCssChunksPlugin.loader },
              { loader: 'css-loader' },
              { loader: 'postcss-loader' },
            ],
          },
          {
            test: /\.less$/,
            use: [
              { loader: ExtractCssChunksPlugin.loader },
              { loader: 'css-loader' },
              { loader: 'postcss-loader' },
              { loader: 'less-loader' },
            ]
          },
          {
            test: /\.tsx?$/,
            loader: "awesome-typescript-loader"
          },
          {
            test: /\.(gif|png|jpe?g|svg)$/i,
            use: [
              {
                loader: 'url-loader',
                options: {
                  limit: 1000,
                  name: 'static/images/[name].[hash:8].[ext]',
                },
              },
            ],
          },
          {
            test: /\.(eot|ttf|woff)/i,
            loader: 'file-loader',
            options: {
              name: 'static/fonts/[name].[hash:8].[ext]',
            },
          },
          {
            loader: 'file-loader',
            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            options: {
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        ]
      }
    ]
  }
};
