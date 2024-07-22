const path = require('path');

module.exports = {
  entry: './src/index.js', 
  output: {
    path: path.resolve(__dirname, 'public/assets/js'),
    filename: 'bundle.js',
    publicPath: '/assets/js/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    historyApiFallback: true,
    compress: true,
    port: 9000,
    hot: true,
    proxy: [
      {
        context: ['/api'], // Define el contexto para las rutas a proxiar
        target: 'http://localhost:5000', // El servidor backend
        changeOrigin: true, // Cambiar el origen de la solicitud a la URL objetivo
        secure: false, // Si es necesario para ignorar problemas con HTTPS
        pathRewrite: {'^/api': ''} // Opcional, para reescribir la ruta
      }
    ]
  }
};
