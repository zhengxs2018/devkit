import { getPackagesSync } from '@lerna/project'
import { filterPackages } from '@lerna/filter-packages'

import type { Package } from './interface'

/**
 * 查找模块
 *
 * @public
 * @param cwd         - 模式使用 process.cwd()
 * @param include     - 指定包含的模块
 * @param exclude     - 需要排除的模块
 * @param showPrivate - 是否显示私有模块
 * @returns 模块列表
 */
export function findPackages(
  cwd?: string,
  include?: string | string[],
  exclude?: string | string[],
  showPrivate = true
): Package[] {
  const packages = getPackagesSync(cwd)
  return filterPackages(packages, include, exclude, showPrivate)
}
