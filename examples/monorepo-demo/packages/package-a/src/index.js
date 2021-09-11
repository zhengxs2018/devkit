import { printMsg } from 'package-d'

printMsg('hello')

export function arrayify(arr) {
  return Array.isArray(arr) ? arr : [arr]
}
