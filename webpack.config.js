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
      'react-hot-loader/patch',
      'babel-polyfill',
      './src/sender.js',
      './src/styles/sender.less',
    ],
    receiver: [
      'react-hot-loader/patch',
      'babel-polyfill',
      './src/receiver.js',
      './src/styles/receiver.less',
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
          path.resolve(__dirname, 'src'),
        ],
        exclude: [
          /node_modules/,
        ],
        loader: 'babel-loader',
        options: {
          presets: ['env', 'react'],
          plugins: ['react-hot-loader/babel'],
        },
      },

      {
        test: /\.ts(x?)$/,
        include: [path.resolve(__dirname, 'src')],
        exclude: [/node_modules/],
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['env', 'react'],
              plugins: ['react-hot-loader/babel'],
            },
          },
          'ts-loader'
        ],
      },

      {
        test: /\.less$/,
        include: [
          path.resolve(__dirname, 'src/styles'),
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
      path.resolve(__dirname, './src'),
      path.resolve(__dirname, './src/styles'),
    ],
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.less', '.json'],
  },
  plugins: [
    extractLess,
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/templates/sender.ejs',
      chunks: ['sender'],
    }),
    new HtmlWebpackPlugin({
      filename: 'receiver/index.html',
      template: 'src/templates/receiver.ejs',
      chunks: ['receiver'],
    }),
    new CompressionPlugin(),
  ],
  devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'eval-source-map',
  devServer: {
    contentBase: './public',
    host: '0.0.0.0',
    port: '8080',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    disableHostCheck: true,
    compress: true,
    inline: true,
    hot: true,
    hotOnly: true,
  },
  stats: 'verbose',
};
