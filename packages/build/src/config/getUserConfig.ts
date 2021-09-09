import path from 'path'
import { cosmiconfig } from 'cosmiconfig'

import type { BundleOptions, ConfigExplorer } from '../types'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function createConfigExplorer(rootDir: string): ConfigExplorer {
  return cosmiconfig('build', {
    stopDir: rootDir,
  })
}

export function getUserConfig(
  explorer: ConfigExplorer,
  cwd: string,
  filename?: string
): Promise<BundleOptions> {
  return typeof filename === 'string'
    ? loadUserConfig(explorer, path.join(cwd, filename))
    : searchUserConfig(explorer, cwd)
}

export async function searchUserConfig(
  explorer: ConfigExplorer,
  searchFrom: string
): Promise<BundleOptions> {
  const result = await explorer.search(searchFrom)
  return result ? result.config : {}
}

export async function loadUserConfig(
  explorer: ConfigExplorer,
  filePath: string
): Promise<BundleOptions> {
  const result = await explorer.load(filePath)
  return result ? result.config : {}
}

export function defineConfig(config: BundleOptions): BundleOptions {
  return config
}
