const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'public/assets/js'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  // plugins: [
  //   new CopyWebpackPlugin({
  //     patterns: [
  //       { from: 'src/resources', to: path.resolve(__dirname, 'public/assets/img') }
  //     ],
  //   }),
  // ],
  mode: 'development', // Cambiar a 'production' para la versión final
};