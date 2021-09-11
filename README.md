# 自用工具库

[![TypeScript](https://img.shields.io/badge/lang-typescript-informational?style=flat-square)](https://www.typescriptlang.org)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](#License)

项目使用自我编译的方式进行打包，添加的子包会自动被编译，默认输出 `cjs`，可以通过在包内添加 `.buildrc` 文件修改导出格式。

编译脚本在 `根目录` 的 `scripts/build.ts` 中，可以配置跳过某些包的编译。

目前暂未想到如何不重复生成类型文件和指定其他目录（如`./types`），所以编译的产物不包括 `*.d.ts`。

如果想生成 `*.d.ts` 文件，可以在 `根目录` 的 `tsconfig.json#references` 配置下。

## 目录结构

```text
├── examples/
│   ├── monorepo-*/                  - monorepo 示例
│   └── package-*/                   - 独立包示例
├── packages/
│   ├── build/
│   ├── eslint-config/
│   ├── lerna/
│   ├── mock/
│   └── testing/
├── scripts/
│   ├── api-extractor.ts
│   └── build.ts
│   ├── clean.ts
└── package.json
```

## 待办列表

- [ ] 支持命令行操作
- [ ] 支持 `yarn create` 创建工程
- [ ] 支持 vue3 工程编译
- [ ] 支持 react 工程编译

## License

- MIT
