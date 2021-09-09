import { ModuleFormat, InputOption, InputOptions, OutputOptions } from 'rollup'
import type { IPackageJson } from 'package-json-type'
import type { cosmiconfig } from 'cosmiconfig'

export type ConfigExplorer = ReturnType<typeof cosmiconfig>

export interface PackageJson extends IPackageJson {
  module?: string
}

export interface BundleOptions
  extends Pick<InputOptions, 'plugins'>,
    Pick<
      OutputOptions,
      | 'banner'
      | 'footer'
      | 'sourcemap'
      | 'assetFileNames'
      | 'chunkFileNames'
      | 'entryFileNames'
      | 'exports'
      | 'globals'
      | 'paths'
    >,
    Partial<Record<ModuleFormat, OutputOptions>> {
  /**
   * 库名称，默认为当前包名称
   */
  name?: string

  /**
   * 指定入口文件
   *
   * 如果存在 `tsconfig.json`，那默认入口为 `src/index.ts`
   *
   * @See {@link https://rollupjs.org/guide/en/#input|input}
   * @defaultValue `src/index.js`
   */
  entry?: InputOption

  /**
   * 输出格式
   *
   * @defaultValue `["es", "cjs", "umd"]`
   */
  formats?: ModuleFormat[]

  /**
   * 输出目录，和 `file` 属性互斥
   *
   * @defaultValue `null`
   */
  dir?: string

  /**
   * 输出文件，和 `dir` 属性互斥
   *
   * @defaultValue `dist/index.[format].js`
   */
  file?: string | ((format: ModuleFormat) => string)

  /**
   * 用于判断是否 ts 工程
   */
  isTypeScript?: boolean

  /**
   * tsconfig.json 文件名称
   *
   * @defaultValue `tsconfig.json`
   */
  tsconfig?: string

  /**
   * 禁用 typescript 编译时的类型检查
   *
   * @defaultValue `false`
   */
  disableTypeCheck?: boolean
}
export interface BuildArgs extends Omit<BundleOptions, 'name'> {
  cwd?: string
  configFile?: string
}
