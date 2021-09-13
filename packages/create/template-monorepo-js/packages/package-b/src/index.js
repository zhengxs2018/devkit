import isNil from 'lodash/isNil'

/**
 * 数组化操作
 *
 * @param {*} value - 值
 * @returns 返回数组
 *
 * @example <caption>基础数据</caption>
 * ```ts
 * arrayify(1)
 * // [1]
 *
 * arrayify('foo')
 * // ['foo']
 *
 * arrayify(['foo', 'bar'])
 * // ['foo', 'bar']
 * ```
 *
 * @example <caption>空值</caption>
 * ```ts
 * arrayify(null)
 * // []
 *
 * arrayify(null)
 * // []
 * ```
 */
export function arrayify(value) {
  if (isNil(value)) return []
  return Array.isArray(value) ? value : [value]
}
