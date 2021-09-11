const { defineConfig } = require('@zhengxs-devkit/build')

// 默认配置，根据需要子包单独覆盖
module.exports = defineConfig({
  formats: ['cjs', 'umd', 'esm'],
  globals: {
    lodash: '_'
  }
})
