import path from 'path'
import { existsSync } from 'fs'

import { camelCase, isNil } from 'lodash'
import parsePackageName from 'parse-pkg-name'
import { arrayify, unwrap } from '@zhengxs-devkit/shared'

import rollup from './rollup'

import { mergeConfig } from './utils/mergeConfig'
import { resolvePath } from './utils/resolvePath'

import type {
  BuildOptions,
  BuildContext,
  UserConfig,
  MergedUserConfig,
} from './types'

export async function build(options: BuildOptions): Promise<void> {
  const {
    rootPath,
    projectFolder,
    rootConfig,
    userConfig,
    packageJson,
    packageFilePath,
  } = options

  const packageName = packageJson['name']!
  const { name: unscopedPackageName } = parsePackageName(packageName)
  const libraryName = camelCase(unscopedPackageName)

  const ctx: BuildContext = {
    rootPath,
    projectFolder,
    packageJson,
    packageFilePath,
    packageName,
    unscopedPackageName,
    libraryName,
    resolvePath(input, data) {
      const normalPath = resolvePath(input, {
        ...data,
        rootPath,
        projectFolder,
        packageName,
        unscopedPackageName,
        libraryName,
      })
      return path.resolve(projectFolder, normalPath)
    },
  }

  async function bundle(userConfig: UserConfig): Promise<void> {
    const config = mergeConfig(
      // copy
      mergeConfig({}, rootConfig || {}),
      userConfig
    )

    // 如果用户未指定是否 ts 项目
    // 就通过 tsconfig.json 文件进行猜测
    if (isNil(config.isTypeScript)) {
      const tsconfigFilePath = ctx.resolvePath(
        config['tsconfigFilePath'] || 'tsconfig.json'
      )
      if (existsSync(tsconfigFilePath)) {
        config.isTypeScript = true
        config.tsconfigFilePath = tsconfigFilePath
      }
    } else {
      if (config.isTypeScript === true) {
        const tsconfigFilePath = ctx.resolvePath(
          config['tsconfigFilePath'] || 'tsconfig.json'
        )
        config.tsconfigFilePath = tsconfigFilePath
      }
    }

    if (isNil(config.entry)) {
      if (config.isTypeScript) {
        config.entry = 'src/index.ts'
      } else {
        config.entry = 'src/index.js'
      }
    }

    if (isNil(config.name)) {
      config.name = libraryName
    }

    if (isNil(config.formats)) {
      config.formats = ['esm', 'cjs', 'umd']
    }

    await rollup(ctx, config as MergedUserConfig)
  }

  const resolvedConfig = await Promise.resolve(unwrap(userConfig || {}, ctx))
  const userConfigs = arrayify(resolvedConfig)
  await Promise.all(userConfigs.map(bundle))
}
