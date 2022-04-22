const wpconfig = require('./webpack.config.js')

module.exports = {
  mode: 'development',
  entry: {
    ...wpconfig.entry
  },
  output: wpconfig.output,
  module: {
    rules: [
      ...wpconfig.module.rules,
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ["source-map-loader"],
      }
    ],
  },
  devtool : 'inline-source-map',
  devServer: {
    contentBase: './public/'
  },
  resolve: wpconfig.resolve,
  plugins: wpconfig.plugins
}