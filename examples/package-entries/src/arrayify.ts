import { isNil } from './shared'

export function arrayify<T>(value: T | T[]): T[] {
  if (isNil(value)) return []
  return Array.isArray(value) ? value : [value]
}
