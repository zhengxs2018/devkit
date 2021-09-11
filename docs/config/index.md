# 配置

## 配置文件

### 配置文件解析

> 注意：如果是 `monorepo` 模式，根配置只允许返回对象。

采用当前主流配置加载方式，默认情况下，从工程目录开始搜索以下内容：

- `package.json` 文件中的 `build` 属性
- `.buildrc`
- `.buildrc.(js|cjs|json|yaml|yml)`
- `build.config.(js|cjs)`

具体说明详见 [cosmiconfig](https://www.npmjs.com/package/cosmiconfig) 模块。

### 配置智能提示

因为工具本身附带 Typescript 类型，所以你可以通过 IDE 和 jsdoc 的配合来实现智能提示：

```js
/**
 * @type {import('@zhengxs-devkit/build').UserConfig}
 */
module.exports = {
  // ...
}
```

另外你可以使用 defineConfig 工具函数，这样不用 jsdoc 注解也可以获取类型提示：

```js
const { defineConfig } = require('@zhengxs-devkit/build')

module.exports = defineConfig({
  // ...
})
```

目前暂不支持 ts 和 esm 模块的配置文件。

### 数组配置

暂不支持指定特定模式的个性化配置，但可以通过数组来解决：

```js
const { defineConfig } = require('@zhengxs-devkit/build')

module.exports = defineConfig([
  {
    formats: ['esm', 'cjs']
  },
  {
    formats: ['umd'],
    // see https://www.npmjs.com/package/rollup-plugin-node-externals
    nodeExternalsOptions: {
      // 把 lodash 的代码打包进来
      // 默认剔除所有依赖项目
      exclude: ['lodash']
    }
  },
])
```

### 情景配置

如果配置文件需要动态配置选项，则可以选择导出这样一个函数：

```js
const { defineConfig } = require('@zhengxs-devkit/build')

module.exports = defineConfig(ctx => {
  return {
    // ...
  }
})
```

### 异步配置

如果配置需要调用一个异步函数，也可以转而导出一个异步函数：

```js
const { defineConfig } = require('@zhengxs-devkit/build')

module.exports = defineConfig(async ctx => {
  return {
    // ...
  }
})
```

## 共享配置

### name

- **类型:** `string`
- **默认:** `undefined`

`umd` 需要的库名称，其他模式可选。

### entry

- **类型:** `string | string [] | { [entryName: string]: string }`
- **默认:** `src/index.ts` | `src/index.js`

入口文件配置，默认根据 `isTypescript` 或 `tsconfigFilePath` 配置自动处理，可覆盖。

更多细节请见 [input](https://rollupjs.org/guide/en/#input)

### formats

- **类型:** `string[]`
- **默认:** `["esm", "cjs", "umd"]`

输出文件格式，更多细节请见 [output.format](https://rollupjs.org/guide/en/#outputformat)

### outFile

- **类型:** `string | ((format: ModuleFormat) => string)`
- **默认:** `dist/[name].[umd].js`

输出文件名称，和 `outDir` 互斥。

更多细节请见 [output.file](https://rollupjs.org/guide/en/#outputfile)
### outDir

- **类型:** `string`
- **默认:** `undefined`

输出目录，搭配 `entryFileNames` 使用使用，和 `outFile` 互斥。

更多细节请见 [output.dir](https://rollupjs.org/guide/en/#outputdir)

## Rollup 配置

### banner

- **类型:** `string`
- **默认:** `undefined`

可以用来设置顶部版权。

更多细节请见 [output.banner](https://rollupjs.org/guide/en/#outputbanner)

### external

- **类型:** `(string | RegExp)[] | RegExp | string | (id: string, parentId: string, isResolved: boolean) => boolean`
- **默认:** `undefined`

剔除外部依赖。

更多细节请见 [external](https://rollupjs.org/guide/en/#external)

### plugins

- **类型:** `Plugin[]`
- **默认:** `[]`

Falsy 虚值的插件将被忽略，放置 `rollup` 支持的插件。

更多细节请见 [plugins](https://rollupjs.org/guide/en/#plugins)

### entryFileNames

- **类型:** `string | ((chunkInfo: ChunkInfo) => string)`
- **默认:** `undefined`

多入口时使用。

更多细节请见 [output.entryFileNames](https://rollupjs.org/guide/en/#outputentryfilenames)

### inlineDynamicImports

- **类型:** `boolean`
- **默认:** `undefined`

动态模块导入

更多细节请见 [output.inlineDynamicImports](https://rollupjs.org/guide/en/#outputinlinedynamicimports)

### sourcemap

- **类型:** `boolean | 'inline' | 'hidden'`
- **默认:** `undefined`

是否生成 `sourcemap` 文件

更多细节请见 [output.sourcemap](https://rollupjs.org/guide/en/#outputsourcemap)

### globals

- **类型:** `boolean | 'inline' | 'hidden'`
- **默认:** `undefined`

`umd` 时使用。

更多细节请见 [output.globals](https://rollupjs.org/guide/en/#outputglobals)

## Typescript 配置

### isTypeScript

- **类型:** `boolean`
- **默认:** `false`

如果 `tsconfigFilePath` 定义的文件存在就为 `true`，可覆盖。

### tsconfigFilePath

- **类型:** `string`
- **默认:** `tsconfig.json`

编译使用的 `tsconfig.json` 文件路径。

### tsconfigFilePath

- **类型:** `string`
- **默认:** `tsconfig.json`

编译使用的 `tsconfig.json` 文件路径。

### tsconfigOverride

- **类型:** `object`

覆盖使用的 `tsconfig.json` 的配置，优先级比文件高。

### disableTypeCheck

- **类型:** `boolean`
- **默认:** `true`

打包时是否禁用 ts 类型检查。

## 集成插件配置

### nodeResolveOptions

- **类型:** [`RollupNodeResolveOptions`](https://github.com/rollup/plugins/tree/master/packages/node-resolve#options)

传递给 [@rollup/plugin-node-resolve](https://github.com/rollup/plugins/tree/master/packages/node-resolve) 插件的选项。

### commonjsOptions

- **类型:** [`RollupCommonJSOptions`](https://github.com/rollup/plugins/tree/master/packages/commonjs#options)

传递给 [@rollup/plugin-commonjs](https://github.com/rollup/plugins/tree/master/packages/commonjs) 插件的选项。

### jsonOptions

- **类型:** [`RollupJsonOptions`](https://github.com/rollup/plugins/tree/master/packages/json#options)

传递给 [@rollup/plugin-json](https://github.com/rollup/plugins/tree/master/packages/json) 插件的选项。

### bubleOptions

- **类型:** [`RollupBubleOptions`](https://github.com/rollup/plugins/tree/master/packages/buble#options)

传递给 [@rollup/plugin-buble](https://github.com/rollup/plugins/tree/master/packages/buble) 插件的选项。

非 `ts` 工程使用的是 `buble` 编译，而不是 `babel`。

### nodeExternalsOptions

- **类型:** [`NodeExternalsOptions`](https://github.com/Septh/rollup-plugin-node-externals#options)

传递给 [rollup-plugin-node-externals](https://github.com/Septh/rollup-plugin-node-externals) 插件的选项。

