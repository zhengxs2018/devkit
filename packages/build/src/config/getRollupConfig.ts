import path from 'path'
import { mapValues, pick, camelCase } from 'lodash'
import type {
  InputOption,
  InputOptions,
  OutputOptions,
  ModuleFormat,
  MergedRollupOptions,
} from 'rollup'
import nodeExternals from 'rollup-plugin-node-externals'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import typescript2 from 'rollup-plugin-typescript2'
import parsePackageName from 'parse-pkg-name'

import { unwrap } from '../utils'
import type { BundleOptions, PackageJson } from '../types'

function resolveEntries(cwd: string, entries?: InputOption): InputOption {
  if (Array.isArray(entries))
    return entries.map(input => path.resolve(cwd, input))
  if (typeof entries === 'string') return path.resolve(cwd, entries)
  return mapValues(entries, input => path.resolve(cwd, input))
}

export async function getRollupConfig(
  cwd: string,
  bundleOpts: BundleOptions
): Promise<MergedRollupOptions> {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const pkg: PackageJson = require(path.resolve(cwd, 'package.json'))
  const pkgName = parsePackageName(pkg.name as string).name
  const {
    isTypeScript,
    entry = isTypeScript ? 'src/index.ts' : 'src/index.js',
    name = camelCase(pkgName),
    formats = ['esm', 'cjs'],
  } = bundleOpts

  const options: MergedRollupOptions = {
    input: resolveEntries(cwd, entry),
    plugins: getRollupPlugins(cwd, bundleOpts),
    output: [],
  }

  const extraOptions = pick(
    bundleOpts,
    'banner',
    'footer',
    'sourcemap',
    'assetFileNames',
    'chunkFileNames',
    'entryFileNames',
    'exports',
    'globals',
    'paths'
  )

  for (const format of formats) {
    options.output.push(
      Object.assign(
        { name, exports: 'named' },
        extraOptions,
        bundleOpts[format],
        getOutputOptions(cwd, pkg, format, bundleOpts)
      )
    )
  }

  return options
}

/**
 * 获取插件列表
 */
export function getRollupPlugins(
  cwd: string,
  bundleOpts: BundleOptions
): InputOptions['plugins'] {
  const plugins: InputOptions['plugins'] = [
    nodeExternals({
      packagePath: path.resolve(cwd, 'package.json'),
      deps: true,
    }),
    nodeResolve(),
    commonjs(),
    json(),
  ]

  if (bundleOpts.isTypeScript) {
    plugins.push(
      typescript2({
        cwd,
        clean: true,
        tsconfig: path.resolve(cwd, bundleOpts.tsconfig || 'tsconfig.json'),
        tsconfigOverride: {
          compilerOptions: {
            // 为了支持动态模块
            target: 'esnext',
            module: 'esnext',
            // todo 防止重复编译和指定目录输出？
            composite: false,
            declaration: false,
            declarationMap: false,
            emitDeclarationOnly: false,
          },
        },
        check: bundleOpts['disableTypeCheck'] !== true,
      })
    )
  }

  return plugins.concat(bundleOpts.plugins || [])
}

export function getOutputOptions(
  cwd: string,
  pkg: PackageJson,
  format: ModuleFormat,
  bundleOpts: BundleOptions
): OutputOptions {
  const outputOptions: OutputOptions = {
    format,
  }

  function getDestOptions(
    keys: string[],
    suffix: string = format
  ): OutputOptions {
    if ('dir' in bundleOpts) {
      return { dir: path.resolve(cwd, bundleOpts['dir']!) }
    }

    if ('file' in bundleOpts) {
      return { file: path.resolve(cwd, unwrap(bundleOpts['file']!, format)) }
    }

    const key = keys.find(key => key in pkg)
    if (key) {
      return { file: path.resolve(cwd, pkg[key] as string) }
    }

    return { file: path.resolve(cwd, `index.${suffix}.js`) }
  }

  switch (format) {
    case 'cjs':
      return Object.assign(outputOptions, getDestOptions(['main'], 'common'))
    case 'es':
    case 'esm':
      return Object.assign(outputOptions, getDestOptions(['module'], 'esm'))
    case 'umd':
      return Object.assign(
        outputOptions,
        getDestOptions(['unpkg', 'browser'], 'umd')
      )
    default:
      return Object.assign(outputOptions, getDestOptions([]))
  }
}
