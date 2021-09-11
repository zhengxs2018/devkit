import { isFunction, Callable } from './shared'

export function unwrap<TReturn>(
  value: TReturn | Callable,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: any[]
): TReturn {
  return isFunction(value) ? value(...args) : value
}
