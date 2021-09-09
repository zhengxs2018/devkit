import { omit } from 'lodash'
import { MergedRollupOptions } from 'rollup'
import { findLernaPackages, PackageFilter } from '@zhengxs-devkit/lerna'

import { getBundleOpts } from '../build/bundle'
import { getRollupConfig } from '../config/getRollupConfig'
import { createConfigExplorer, getUserConfig } from '../config/getUserConfig'
import type { BuildArgs, BundleOptions } from '../types'

import { bundle } from './bundle'

export interface BuildForLernaArgs extends BuildArgs {
  cwd?: string
  pkgs?: string[] | PackageFilter
}

export async function* getRollupConfigsForLerna(
  args: BuildForLernaArgs = {}
): AsyncGenerator<MergedRollupOptions> {
  const { cwd = process.cwd(), configFile, pkgs } = args
  const buildArgs: BundleOptions = omit(args, 'cwd', 'configFile', 'pkgs')
  const configExplorer = createConfigExplorer(cwd)
  const rootConfig = await getUserConfig(configExplorer, cwd, configFile)

  for (const pkg of findLernaPackages(cwd, pkgs)) {
    const rootPath = pkg.location
    const bundleOptsArray = await getBundleOpts(
      {
        cwd: rootPath,
        configExplorer,
        rootConfig,
      },
      buildArgs
    )

    for (const bundleOpts of bundleOptsArray) {
      yield await getRollupConfig(rootPath, bundleOpts)
    }
  }
}

export async function buildForLerna(
  args: BuildForLernaArgs = {}
): Promise<void> {
  for await (const config of getRollupConfigsForLerna(args)) {
    const build = await bundle(config, async (build, options) => {
      await build.write(options)
    })
    build.close()
  }
}
