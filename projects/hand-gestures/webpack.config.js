const webpack = require('webpack')
const path = require('path')

module.exports = {
  mode: 'production',
  entry: {
    index: "./public/js/index.js",
  },
  output: {
    filename: "[name].js",
    path: path.join(__dirname, 'public'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              // https://stackoverflow.com/questions/53558916/babel-7-referenceerror-regeneratorruntime-is-not-defined
              [
                '@babel/preset-env',
                {
                  useBuiltIns: "entry", // alternative mode: "entry"
                  corejs: 3, // default would be 2
                  targets: "> 0.25%, not dead" 
                }
              ]
            ],
            plugins: [ "@babel/plugin-proposal-class-properties" ]
          }
        }
      },
    ],
  },
  resolve: {
    alias: {
      vue: "vue/dist/vue.esm-bundler.js"
    },
    modules: ['node_modules']
  },
  plugins: [
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
    }),
  ],
}
