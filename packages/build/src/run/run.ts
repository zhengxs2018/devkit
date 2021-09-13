import path from 'path'
import type { PackageJson } from '@zhengxs-devkit/types'

import { build } from '../build'
import { configLoader } from '../utils/configLoader'

export interface RunOptions {
  /**
   * 当前路径
   *
   * @defaultValue `process.cwd()`
   */
  cwd?: string

  /**
   * 配置文件
   *
   * @defaultValue ".buildrc"
   */
  configFilePath?: string
}

export async function run(options: RunOptions = {}): Promise<void> {
  const { cwd: rootPath = process.cwd(), configFilePath } = options

  const loadConfig = configLoader(rootPath)
  const userConfig = await loadConfig(rootPath, configFilePath)

  const packageFilePath = path.resolve(rootPath, 'package.json')
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const packageJson: PackageJson = require(packageFilePath)

  return build({
    rootPath,
    projectFolder: rootPath,
    rootConfig: null,
    userConfig,
    packageJson,
    packageFilePath,
  })
}
