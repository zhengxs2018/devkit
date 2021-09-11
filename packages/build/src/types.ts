import type {
  InputOption,
  InputOptions,
  OutputOptions,
  ModuleFormat,
} from 'rollup'
import type { RollupNodeResolveOptions } from '@rollup/plugin-node-resolve'
import type { RollupCommonJSOptions } from '@rollup/plugin-commonjs'
import type { RollupBubleOptions } from '@rollup/plugin-buble'
import type { RollupJsonOptions } from '@rollup/plugin-json'
import type { ExternalsOptions } from 'rollup-plugin-node-externals'
import type { RPT2Options } from 'rollup-plugin-typescript2'

import type { PackageJson } from '@zhengxs-devkit/types'

export interface BundleInputOptions extends Pick<InputOptions, 'plugins'> {
  /**
   * 指定入口文件
   *
   * @see https://rollupjs.org/guide/en/#input
   * @defaultValue `src/index.js`
   */
  entry?: InputOption
}

export interface BundleOutputOptions
  extends Pick<
    OutputOptions,
    | 'banner'
    | 'sourcemap'
    | 'assetFileNames'
    | 'chunkFileNames'
    | 'entryFileNames'
    | 'globals'
    | 'paths'
  > {
  /**
   * 导出的全局引用的名称
   *
   * @see https://rollupjs.org/guide/en/#outputname
   * @defaultValue `<unscopedPackageName>`
   */
  name?: string

  /**
   * 输出格式
   *
   * @see https://rollupjs.org/guide/en/#outputformat
   * @defaultValue `["es", "cjs", "umd"]`
   */
  formats?: ModuleFormat[]

  /**
   * 多文件输出目录，和 `outFile` 属性互斥
   *
   * @see https://rollupjs.org/guide/en/#outputdir
   * @defaultValue `null`
   */
  outDir?: string

  /**
   * 单文件输出，和 `outDir` 属性互斥
   *
   * @see https://rollupjs.org/guide/en/#outputfile
   * @defaultValue `dist/index.[format].js`
   */
  outFile?: string | ((format: ModuleFormat, ctx: BuildContext) => string)
}

export interface UserConfig extends BundleOutputOptions, BundleInputOptions {
  /**
   * 传递给 `@rollup/plugin-node-resolve` 插件的选项。
   */
  nodeResolveOptions?: RollupNodeResolveOptions

  /**
   * 传递给 `@rollup/plugin-commonjs` 插件的选项。
   */
  commonjsOptions?: RollupCommonJSOptions

  /**
   * 传递给 `@rollup/plugin-json` 插件的选项。
   */
  jsonOptions?: RollupJsonOptions

  /**
   * 传递给 `@rollup/plugin-buble` 插件的选项。
   */
  bubleOptions?: RollupBubleOptions

  /**
   * 传递给 `rollup-plugin-node-externals` 插件的选项。
   */
  nodeExternalsOptions?: ExternalsOptions

  // todo
  // minify: boolean | 'terser' | 'esbuild'

  /**
   * 是否 typescript 项目
   */
  isTypeScript?: boolean

  /**
   * 自定义 tsconfig 文件路径
   */
  tsconfigFilePath?: string

  /**
   * 允许外部覆盖 tsconfig.json 的配置
   *
   * @see https://aka.ms/tsconfig.json
   */
  tsconfigOverride?: RPT2Options['tsconfigOverride']

  /**
   * 是否禁用 ts 类型检查
   */
  disableTypeCheck?: boolean
}

export interface MergedUserConfig extends UserConfig {
  name: string
  entry: InputOption
  formats: ModuleFormat[]
  isTypeScript: boolean
}

export type UserConfigFunction = (
  ctx: BuildContext
) => UserConfig | UserConfig[] | Promise<UserConfig>

export type BundleOptions = {
  rootPath: string
  projectFolder: string
  packageJson: PackageJson
  packageFilePath: string
}

export interface BuildOptions extends BundleOptions {
  rootConfig: UserConfig | null
  userConfig: UserConfig | UserConfig[] | UserConfigFunction | null
}

export interface BuildContext extends BundleOptions {
  packageName: string
  unscopedPackageName: string
  libraryName: string
  resolvePath: (path: string, data?: Record<string, string>) => string
}
