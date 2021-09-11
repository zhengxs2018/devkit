import { isFunction, isNil } from 'lodash'

export function arrayify<T>(value: T | T[]): T[] {
  if (isNil(value)) return []
  return Array.isArray(value) ? value : [value]
}

export function unwrap<TReturn, TArgs extends unknown[]>(
  value: TReturn | ((...args: TArgs) => TReturn),
  ...args: TArgs
): TReturn {
  return isFunction(value) ? value(...args) : value
}
