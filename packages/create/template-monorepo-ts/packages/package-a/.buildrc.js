const { defineConfig } = require('@zhengxs-devkit/build')

// umd 时包含依赖，但 esm 和 cjs 时剔除
module.exports = defineConfig([
  {
    formats: ['esm', 'cjs']
  },
  {
    formats: ['umd'],
    // see https://www.npmjs.com/package/rollup-plugin-node-externals
    nodeExternalsOptions: {
      // 不剔除 package-d 的依赖
      exclude: ['package-d'],
    },
  },
])
