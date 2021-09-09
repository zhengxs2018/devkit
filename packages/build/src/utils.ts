/* eslint-disable @typescript-eslint/no-explicit-any */
export function arrayify<T>(arr: T | T[]): T[] {
  return Array.isArray(arr) ? arr : [arr]
}

export function unwrap<T>(
  value: T | ((...args: any[]) => T),
  ...args: any[]
): T {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return typeof value === 'function' ? value(...args) : value
}
