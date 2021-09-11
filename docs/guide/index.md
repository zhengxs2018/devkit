# 开始

## 总览

[@zhengxs-devkit/build](https://www.npmjs.com/package/@zhengxs-devkit/build) 意在提供开箱即用的配置，提供目前常用的几种配置方式，支持导出 `esm`，`cjs`，`umd` 等编译产物。

同时支持 [monorepo](./run-in-lerna) 和 [package](./run) 两种编译方式，可以在 [最佳实践](/) 了解 2 种方式的优缺点。

## 配置加载方式

> 注意：如果是 `monorepo` 模式，根配置只允许返回对象。

采用当前主流配置加载方式，默认情况下，从工程目录开始搜索以下内容：

- `package.json` 文件中的 `build` 属性
- `.buildrc`
- `.buildrc.(js|cjs|json|yaml|yml)`
- `build.config.(js|cjs)`

具体说明详见 [cosmiconfig](https://www.npmjs.com/package/cosmiconfig) 模块。

## 多入口打包

目录结构

```text
├── src/
│   ├── main-a.js
│   └── main-b.js
├── .buildrc.js
└── package.json
```

配置文件

```js
const { defineConfig } = require('@zhengxs-devkit/build')

module.exports = defineConfig({
  /**
   * 注意 umd 和 iife 不支持代码拆分
   * 
   * 默认输出：umd，esm，cjs
   */
  formats: ['cjs'],
  /**
  * 具体说明详见 rollup 官方文档
  *
  * @see https://rollupjs.org/guide/en/#input
  */
  entry: {
    index: 'src/index.js',
    arrayify: 'src/arrayify.js',
    unwrap: 'src/unwrap.js',
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
```

输出产物

```text
├── dist/
│   ├── index.js
│   ├── arrayify.js
│   ├── shared-[hash].js
│   └── unwrap.js
├── src/
│   ├── index.ts
│   ├── arrayify.ts
│   ├── shared.ts
│   └── unwrap.ts
├── .buildrc.js
└── package.json
```

查看 [多入口打包](https://github.com/zhengxs2018/zhengxs-devkit/tree/main/examples/package-entries) 以获取更多细节。

## 社区

如果你有疑问或者需要帮助，可以到 [GitHub 讨论区][github discussions] 来寻求帮助。

[github discussions]: https://github.com/zhengxs2018/zhengxs-devkit/discussions
