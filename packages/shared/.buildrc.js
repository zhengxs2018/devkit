const { defineConfig } = require('@zhengxs-devkit/build')

module.exports = defineConfig({
  formats: ['cjs', 'esm', 'umd'],
  globals: {
    lodash: '_'
  }
})
