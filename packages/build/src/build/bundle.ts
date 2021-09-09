import path from 'path'
import { existsSync } from 'fs'
import { mergeWith, isFunction } from 'lodash'
import { rollup, OutputOptions, MergedRollupOptions, RollupBuild } from 'rollup'

import { arrayify } from '../utils'
import { searchUserConfig } from '../config/getUserConfig'
import type { BundleOptions, ConfigExplorer } from '../types'

export type Context = {
  cwd: string
  rootConfig: BundleOptions
  configExplorer: ConfigExplorer
}

/**
 * 合并打包配置
 *
 * @public
 * @param object  - 目标配置
 * @param sources - 来源配置
 * @returns 合并后的打包配置
 */
export function mergeBundleOptions(
  object: BundleOptions,
  sources: BundleOptions
): BundleOptions {
  return mergeWith(
    object,
    sources,
    (value, srcValue, key: keyof BundleOptions) => {
      switch (key) {
        case 'paths':
          return Object.assign({}, value, srcValue)
        case 'globals':
          if (isFunction(srcValue)) return srcValue
          if (isFunction(value)) {
            return srcValue || value
          } else {
            return Object.assign({}, value, srcValue)
          }
        case 'plugins':
          return [].concat(value || [], srcValue || [])
        default:
          return srcValue || value
      }
    }
  )
}

/**
 * 获取打包配置
 * 编译参数拥有最高优先级
 * 合并规则: defaultOptions -\> rootConfig -\> userConfig -\> buildArgs
 *
 * @public
 * @param opts      - 上下文
 * @param buildArgs - 编译参数
 * @returns
 */
export async function getBundleOpts(
  context: Context,
  buildArgs: BundleOptions
): Promise<BundleOptions[]> {
  const { cwd, configExplorer, rootConfig = {} } = context
  const userConfigs = arrayify(await searchUserConfig(configExplorer, cwd))

  return userConfigs.map(userConfig => {
    const tsconfig = path.join(cwd, 'tsconfig.json')
    const defaultOptions: BundleOptions = {
      tsconfig,
      isTypeScript: existsSync(tsconfig),
    }

    return mergeBundleOptions(
      mergeBundleOptions(
        mergeBundleOptions(defaultOptions, rootConfig),
        userConfig
      ),
      buildArgs
    )
  })
}

export async function bundle(
  config: MergedRollupOptions,
  writeFile: (build: RollupBuild, outputOpts: OutputOptions) => Promise<void>
): Promise<RollupBuild> {
  const build = await rollup(config)
  await Promise.all(config.output.map(opts => writeFile(build, opts)))
  return build
}
