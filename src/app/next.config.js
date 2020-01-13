module.exports = {
  distDir: '../../dist/functions/next',
}
const withSass = require('@zeit/next-sass')
module.exports = withSass({
  /* config options here */
  // cssModules: true
})
