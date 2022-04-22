const {src, dest, series} = require('gulp')
const gclean = require('gulp-clean')
const webpack = require('webpack')

const OUTPUT_DIR = 'dist';

// Webpack Output Formatting
const formatStats = s => s.toString({colors: true})

// Production Actions
const clean = _ => src(OUTPUT_DIR, {allowEmpty:true}).pipe(gclean())
const structure = _ => src('package.json', {read: false}).pipe(dest(`${OUTPUT_DIR}/data`))
const build = _ => new Promise(
  (resolve, reject) => webpack(
    require('./webpack.config.js'),
    (err, stats) => err ? reject(err) : (stats.hasErrors()? reject: resolve)(formatStats(stats)))
)
const copy = _ => src(['public/**/*', 'src/**/*'], {base: '.'}).pipe(dest(OUTPUT_DIR))

// Development Actions
const local = {
  watch: _ => new Promise(
    _ => webpack(require('./webpack.dev.config'))
    .watch({}, (_, stats) => console.info(formatStats(stats)))
  ),
  clean: _ => src(['public/index.js'], {allowEmpty: true, read: false}).pipe(gclean())
} 

// const wpbuild = _ => new Promise((resolve, reject) => {
//   webpack(
//     wpconfig,
//     (err, stats) => err? reject(err): stats.hasErrors()? reject(new Error(stats.toString({colors: true}))): resolve(stats.toString({colors: true}))
//   )
// })

// const wpwatch = _ => new Promise(_ => {
//   const compiler = webpack(devconfig)
//   compiler.watch({}, (_, stats) => {
//     console.info(stats.toString({colors: true}))
//   })
// })

module.exports = {
  build: series(clean, local.clean, structure, build, copy),
  clean: series(clean, local.clean),

  // Local Operations
  local: local.watch,
  localclean: local.clean,
}