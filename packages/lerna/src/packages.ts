import { isObject } from 'lodash'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { getPackagesSync } from '@lerna/project'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { filterPackages } from '@lerna/filter-packages'

import type { LernaPackage, PackageFilter } from './types'

/**
 * 获取 lerna 项目的包列表
 *
 * 纯 js 应该直接用 `@lerna/project` 模块
 *
 * @public
 * @param cwd - Defaults to process.cwd()
 * @returns 包列表
 */
export function getLernaPackages(cwd?: string): LernaPackage[] {
  return getPackagesSync(cwd)
}

/**
 * Filters a list of packages, returning all packages that match the `include` glob[s]
 * and do not match the `exclude` glob[s].
 *
 * 纯 js 应该直接用 `@lerna/filter-packages` 模块
 *
 * @param packagesToFilter  - The packages to filter
 * @param include           - A list of globs to match the package name against
 * @param exclude           - A list of globs to filter the package name against
 * @param showPrivate       - When false, filter out private packages
 * @param continueIfNoMatch - When true, do not throw if no package is matched
 * @throws when a given glob would produce an empty list of packages and `continueIfNoMatch` is not set.
 */
export function filterLernaPackages(
  packagesToFilter: LernaPackage[],
  include?: string | string[],
  exclude?: string | string[],
  showPrivate?: boolean,
  continueIfNoMatch?: boolean
): LernaPackage[] {
  return filterPackages(
    packagesToFilter,
    include,
    exclude,
    showPrivate,
    continueIfNoMatch
  )
}

export function findAndFilterLernaPackages(
  cwd: string,
  opts?: string | string[] | PackageFilter
): LernaPackage[] {
  const { include, exclude, skipPrivate, continueIfNoMatch } =
    normalizeFilterOpts(opts)

  return filterPackages(
    getPackagesSync(cwd),
    include,
    exclude,
    skipPrivate,
    continueIfNoMatch
  )
}

function normalizeFilterOpts(
  opts?: string | string[] | PackageFilter
): PackageFilter {
  if (Array.isArray(opts)) return { include: opts }
  return isObject(opts) ? (opts as PackageFilter) : { include: opts }
}
