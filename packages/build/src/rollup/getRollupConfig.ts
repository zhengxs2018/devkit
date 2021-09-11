import { mapValues, pick } from 'lodash'

import type {
  InputOption,
  InputOptions,
  OutputOptions,
  ModuleFormat,
  MergedRollupOptions,
} from 'rollup'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import nodeExternals from 'rollup-plugin-node-externals'
import json from '@rollup/plugin-json'
import buble from '@rollup/plugin-buble'
import typescript2 from 'rollup-plugin-typescript2'

import { unwrap } from '@zhengxs-devkit/shared'

import type { BuildContext, MergedUserConfig } from '../types'

export function getRollupConfig(
  ctx: BuildContext,
  userConfig: MergedUserConfig
): MergedRollupOptions {
  const { name, entry, formats } = userConfig

  const options: MergedRollupOptions = {
    input: getInputOption(ctx, entry!),
    plugins: getRollupPlugins(ctx, userConfig),
    output: [],
  }

  const userOutputOptions = pick(
    userConfig,
    'banner',
    // 'assetFileNames',
    // 'chunkFileNames',
    'entryFileNames',
    'paths',
    'globals',
    'exports',
    'sourcemap'
  )

  for (const format of formats!) {
    options.output.push({
      name,
      format,
      exports: 'named',
      ...userOutputOptions,
      ...getOutOption(ctx, userConfig, format),
    })
  }

  return options
}

export function getInputOption(
  { resolvePath }: BuildContext,
  entry: InputOption
): InputOption {
  if (Array.isArray(entry)) return entry.map(file => resolvePath(file))
  if (typeof entry === 'string') return resolvePath(entry)
  return mapValues(entry, file => resolvePath(file))
}

export function getOutOption(
  ctx: BuildContext,
  userConfig: MergedUserConfig,
  format: ModuleFormat
): OutputOptions {
  const { resolvePath, packageJson } = ctx
  const { outFile, outDir } = userConfig

  if (typeof outDir == 'string') {
    return { dir: resolvePath(outDir) }
  }

  let file: string | undefined = unwrap(outFile, format, ctx)
  if (!file) {
    switch (format) {
      case 'cjs':
      case 'commonjs':
        file = packageJson['main']
        break
      case 'es':
      case 'esm':
      case 'module':
        file = packageJson['module']
        break
      case 'umd':
        file = packageJson['unpack'] || packageJson['browser']
        break
    }
  }
  if (!file) file = 'dist/[unscopedPackageName].[format].js'
  return { file: resolvePath(file, { format }) }
}

export function getRollupPlugins(
  ctx: BuildContext,
  userConfig: MergedUserConfig
): InputOptions['plugins'] {
  const { projectFolder, packageFilePath } = ctx
  const {
    nodeResolveOptions,
    nodeExternalsOptions,
    commonjsOptions,
    jsonOptions,
    bubleOptions,
    isTypeScript,
    tsconfigOverride = {},
  } = userConfig
  const {
    plugins: userPlugins,
    tsconfigFilePath,
    disableTypeCheck = false,
  } = userConfig

  const plugins: InputOptions['plugins'] = [
    nodeExternals({
      deps: true,
      packagePath: packageFilePath,
      ...nodeExternalsOptions,
    }),
    nodeResolve({
      rootDir: projectFolder,
      ...nodeResolveOptions,
    }),
    commonjs(commonjsOptions),
    json(jsonOptions),
  ]

  if (isTypeScript) {
    const { compilerOptions, ...extraOptions } = tsconfigOverride
    plugins.push(
      typescript2({
        cwd: projectFolder,
        clean: true,
        tsconfig: tsconfigFilePath,
        tsconfigOverride: {
          ...extraOptions,
          compilerOptions: {
            ...compilerOptions,
            // 为了支持动态模块
            target: 'esnext',
            module: 'esnext',
            // 解决 `TS6304: Composite projects may not disable declaration emit` 问题
            composite: false,
            // 防止用户设置 emitDeclarationOnly=true
            emitDeclarationOnly: false,
            // todo 如何解决重复生成问题？
            // todo 如何指定目录输出 `.d.ts` 文件？
            declaration: false,
            declarationMap: false,
          },
        },
        check: disableTypeCheck !== true,
      })
    )
  } else {
    plugins.push(buble(bubleOptions))
  }

  return plugins.concat(userPlugins || [])
}
