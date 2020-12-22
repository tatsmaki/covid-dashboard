const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'development',
  entry: {
    index: path.join(__dirname, './src/index.js'),
    chart: path.join(__dirname, './src/components/Graph.js'),
    map: path.join(__dirname, './src/components/Map.js'),
  },
  target: 'web',
  devtool: 'source-map',
  resolve: {
    extensions: ['.js'],
    alias: {},
  },
  output: {
    path: path.join(__dirname, './dist'),
    filename: '[name].bundle.js',
    publicPath: './',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: [/node_modules/],
      },
      { test: /\.(sc|sa|c)ss$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'] },
      {
        test: /\.svg$/,
        loader: 'file-loader',
      },
      {
        test: /\.geojson/,
        loader: 'json-loader'
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './src/index.html'),
    }),
    new MiniCssExtractPlugin({ filename: 'index.css' }),
  ],
  devServer: {
    contentBase: './src/public',
    port: 3000,
  },
};
