import path from 'path'

import {
  findAndFilterLernaPackages,
  PackageFilter,
  LernaPackage,
} from '@zhengxs-devkit/lerna'
import type { PackageJson } from '@zhengxs-devkit/types'

import { build } from '../build'
import { UserConfig } from '../types'
import { configLoader } from '../utils/configLoader'

import type { RunOptions } from './run'

export type RunInLernaOptions = PackageFilter & RunOptions

export async function runInLerna(options: RunInLernaOptions): Promise<void> {
  const { cwd: rootPath = process.cwd(), configFilePath } = options

  const findOrLoadConfig = configLoader(rootPath)
  const rootConfig = await findOrLoadConfig(rootPath, configFilePath)

  // todo 根目录配置会和项目配置合并，所以无法使用数组
  if (Array.isArray(rootConfig)) {
    throw new Error(`Lerna 模式下根目录的配置不支持数组`)
  }

  if (typeof rootConfig === 'function') {
    throw new Error(`Lerna 模式下根目录的配置不支持函数`)
  }

  async function bundleForPackage(pkg: LernaPackage) {
    const projectFolder = pkg.location
    const packageJson: PackageJson = pkg.toJSON()
    const packageFilePath = path.resolve(projectFolder, 'package.json')
    const userConfig = await findOrLoadConfig(projectFolder)

    return build({
      rootPath,
      projectFolder,
      rootConfig: rootConfig as UserConfig,
      userConfig,
      packageJson,
      packageFilePath,
    })
  }

  const packages = findAndFilterLernaPackages(rootPath, options)
  await Promise.all(packages.map(bundleForPackage))
}
