# 开始

## 总览

[@zhengxs-devkit/build](https://www.npmjs.com/package/@zhengxs-devkit/build) 意在提供开箱即用的配置，提供目前常用的几种配置方式，支持输出 `esm`，`cjs`，`umd` 等格式的编译产物。

同时支持 [monorepo](./run-in-lerna) 和 [package](./run) 两种编译方式，可以在 [最佳实践](/) 了解 2 种方式的优缺点。

## 创建一个工程

使用 NPM:

```bash
$ npm init devkit@latest
```

使用 Yarn:

```shell
$ yarn create devkit
```

然后按照提示操作即可！

你还可以通过附加的命令行选项直接指定项目名称和你想要使用的模板。

例如，要构建一个 Lerna + Typescript 项目，运行:

```bash
# npm 6.x
npm init devkit@latest my-devkit-project --template monorepo-ts

# npm 7+, 需要额外的双横线：
npm init devkit@latest my-devkit-project -- --template monorepo-ts

# yarn
yarn create devkit my-vue-devkit-project --template monorepo-ts
```

支持的模板预设包括：

- `package-js`
- `package-ts`
- `monorepo-js`
- `monorepo-ts`

查看 [create-devkit](https://github.com/zhengxs-devkit/devkit/tree/main/packages/create) 以获取每个模板的更多细节。

## 多入口打包

目录结构

```text
├── src/
│   ├── arrayify.js
│   ├── unwrap.js
│   └── index.js
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

查看 [多入口打包](https://github.com/zhengxs-devkit/devkit/tree/main/examples/package-entries) 以获取更多细节。

## 社区

如果你有疑问或者需要帮助，可以到 [GitHub 讨论区][github discussions] 来寻求帮助。

[github discussions]: https://github.com/zhengxs-devkit/devkit/discussions
