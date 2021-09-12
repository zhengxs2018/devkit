# 快速开始

## 搭建第一个项目

> 包占坑中，功能正在实现

使用 NPM:

```bash
$ npm init zdk@latest
```

使用 Yarn:

```bash
$ yarn create zdk
```

然后按照提示操作即可！

你还可以通过附加的命令行选项直接指定项目名称和你想要使用的模板。例如，要构建一个 Monorepo + Typescript 项目，运行:

```bash
# npm 6.x
npm init zdk@latest my-project --template monorepo-ts

# npm 7+, 需要额外的双横线：
npm init zdk@latest my-project-- --template monorepo-ts

# yarn
yarn create zdk my-project --template monorepo-ts
```

支持的模板预设包括：

- `pure-js`
- `pure-ts`
- `monorepo-js`
- `monorepo-ts`

查看 [create](https://github.com/zhengxs-devkit/devkit/tree/main/packages/create) 以获取每个模板的更多细节。
