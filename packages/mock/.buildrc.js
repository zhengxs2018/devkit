module.exports = {
  formats: ['cjs', 'esm', 'umd'],
  file(format) {
    return `dist/index.${format}.js`
  },
  globals: {
    'better-mock': 'Mock',
    'path-to-regexp': 'pathToRegexp'
  }
}
