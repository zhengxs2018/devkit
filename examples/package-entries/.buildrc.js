const { defineConfig } = require('@zhengxs-devkit/build')

module.exports = defineConfig({
  /**
   * 注意 umd 和 iife 不支持代码拆分
   */
  formats: ['cjs'],
  /**
  * 具体说明详见 rollup 官方文档
  *
  * @see https://rollupjs.org/guide/en/#input
  */
  entry: {
    index: 'src/index.ts',
    arrayify: 'src/arrayify.ts',
    unwrap: 'src/unwrap.ts',
  },
  /**
   * 具体说明详见 rollup 官方文档
   * 文件输出的路径是基于 outDir 来的
   * 
   * @see https://rollupjs.org/guide/en/#outputentryfilenames
   * @type {import('rollup').RenderedChunk}
   */
  entryFileNames: '[name].js',
  /**
   * 如果是多文件一定要设置输出目录
   * @see https://rollupjs.org/guide/en/#outputdir
   */
  outDir: 'dist',
})
