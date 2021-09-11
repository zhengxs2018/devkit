import { isFunction } from 'lodash'

export function arrayify(arr) {
  return Array.isArray(arr) ? arr : [arr]
}

export function unwrap(value, ...args) {
  return isFunction(value) ? value(...args) : value
}
