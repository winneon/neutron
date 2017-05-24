'use strict'

let webpack = require('webpack')
let path = require('path')

module.exports = {
  devtool: process.env.NODE_ENV === 'production' ? 'hidden-source-map' : 'cheap-eval-source-map',
  entry: path.join(__dirname, 'lib', 'main.js'),
  output: {
    path: path.join(__dirname, 'app', 'dist'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader'
      }
    ]
  },
  target: 'electron'
}
