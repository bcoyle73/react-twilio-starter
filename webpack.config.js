var path = require('path');
var webpack = require('webpack');

var port = 8080;
var publicPath = '/assets/';

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'app.js',
  },
  devServer: {
    contentBase: "build/",
    proxy: {
      "/api/*": {
        target: "http://localhost:3000",
        secure: false
      }
    }
  },
  module: {
    loaders: [
      {
        test: /.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.css$/,
        loader: 'style!css'
      }
    ]
  },
};
