// @ts-check
const { defineConfig } = require('@zhengxs-devkit/build')

// see https://zhengxs-devkit.github.io/devkit/config/
module.exports = defineConfig([
  {
    formats: ['esm', 'cjs']
  },
  {
    formats: ['umd'],
    nodeExternalsOptions: {
      exclude: ['lodash']
    }
  }
])
