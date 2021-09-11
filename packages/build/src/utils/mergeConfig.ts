import { mergeWith, defaultTo, isObject, isFunction } from 'lodash'
import type { GlobalsOption } from 'rollup'

import type { UserConfig } from '../types'

export function mergeConfig(
  object: UserConfig,
  sources: UserConfig
): UserConfig {
  function customizer<K extends keyof UserConfig, U extends UserConfig[K]>(
    value: U,
    srcValue: U,
    key: K
  ): U {
    if (key === 'globals') {
      return mergeGlobalsOption(
        value as GlobalsOption,
        srcValue as GlobalsOption
      ) as U
    }

    return defaultTo(srcValue, value)
  }

  return mergeWith(object, sources, customizer)
}

function mergeGlobalsOption(
  value?: GlobalsOption,
  srcValue?: GlobalsOption
): GlobalsOption | undefined {
  if (isFunction(srcValue)) return srcValue
  if (isObject(srcValue)) {
    return isFunction(value) ? srcValue : Object.assign({}, value, srcValue)
  }
  return value || srcValue
}
