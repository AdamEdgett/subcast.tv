const path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const extractLess = new ExtractTextPlugin({
  filename: '[name].css',
});

module.exports = {
  context: __dirname,

  entry: {
    sender: [
      'babel-polyfill',
      './src/js/sender.js',
      './src/less/sender.less',
    ],
    receiver: [
      'babel-polyfill',
      './src/js/receiver.js',
      './src/less/receiver.less',
    ],
  },

  output: {
    path: path.resolve(__dirname, 'public'),
    publicPath: '/',
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: [
          path.resolve(__dirname, 'src/js'),
        ],
        exclude: [
          /node_modules/,
        ],
        loader: 'babel-loader',
        options: {
          presets: ['env', 'react'],
        },
      },

      {
        test: /\.less$/,
        include: [
          path.resolve(__dirname, 'src/less'),
        ],
        use: extractLess.extract({
          use: [
            'css-loader',
            'less-loader',
          ],
          fallback: 'style-loader',
        }),
      },
    ],
  },

  resolve: {
    modules: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, './src/js/sender'),
      path.resolve(__dirname, './src/less'),
    ],
    extensions: ['.js', '.jsx', '.less', '.json'],
  },
  plugins: [
    extractLess,
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/templates/sender.ejs',
      chunks: ['sender'],
    }),
    new HtmlWebpackPlugin({
      filename: 'receiver.html',
      template: 'src/templates/receiver.ejs',
      chunks: ['receiver'],
    }),
    new CompressionPlugin(),
  ],
  devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'eval-source-map',
  devServer: {
    contentBase: './public',
    port: '8080',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    compress: true,
    inline: true,
  },
  stats: 'verbose',
};
