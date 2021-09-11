import { isFunction } from 'lodash'

export function arrayify<T>(arr: T | T[]): T[] {
  return Array.isArray(arr) ? arr : [arr]
}

export function unwrap<TReturn, TArgs extends unknown[]>(
  value: TReturn | ((...args: TArgs) => TReturn),
  ...args: TArgs
): TReturn {
  return isFunction(value) ? value(...args) : value
}
