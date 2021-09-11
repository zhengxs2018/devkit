import { isFunction } from 'lodash'

export function unwrap<TReturn, TArgs extends unknown[]>(
  value: TReturn | ((...args: TArgs) => TReturn),
  ...args: TArgs
): TReturn {
  return isFunction(value) ? value(...args) : value
}
