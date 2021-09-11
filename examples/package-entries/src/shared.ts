// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Callable = (...args: any[]) => any

export function isFunction(value: unknown): value is Callable {
  return typeof value === 'function'
}

export function isNil(value: unknown): value is null | undefined {
  return value === null || value === undefined
}
