import path from 'path'

import { cosmiconfig } from 'cosmiconfig'
import type { CosmiconfigResult } from 'cosmiconfig/dist/types'

import type { UserConfig, UserConfigFunction } from '../types'

export type ConfigLoader = (
  projectFolder: string,
  configFile?: string
) => Promise<UserConfig | UserConfigFunction | null>

export function configLoader(rootPath: string = process.cwd()): ConfigLoader {
  const explorer = cosmiconfig('build', { stopDir: rootPath })

  return async (projectFolder: string, configFile?: string) => {
    let result: CosmiconfigResult
    if (typeof configFile === 'string') {
      result = await explorer.load(path.resolve(projectFolder, configFile))
    } else {
      result = await explorer.search(projectFolder)
    }
    return result ? result.config : null
  }
}
