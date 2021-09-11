import { arrayify, unwrap } from './index'

it('arrayify', () => {
  expect(arrayify('')).toEqual([''])
  expect(arrayify(null)).toEqual([])
  expect(arrayify(undefined)).toEqual([])
  expect(arrayify([])).toEqual([])

  expect(arrayify('foo')).toEqual(['foo'])
  expect(arrayify(100)).toEqual([100])
  expect(arrayify(false)).toEqual([false])
  expect(arrayify({})).toEqual([{}])
  expect(arrayify([100, 200])).toEqual([100, 200])
})

it('unwrap', () => {
  expect(unwrap('')).toBe('')
  expect(unwrap(100)).toBe(100)
  expect(unwrap(false)).toBe(false)
  expect(unwrap(undefined)).toBe(undefined)
  expect(unwrap(null)).toBe(null)

  expect(unwrap({ a: 1 })).toEqual({ a: 1 })
  expect(unwrap(['foo'])).toEqual(['foo'])

  function sum(...args: number[]): number {
    return args.reduce((sum, arg) => sum + arg, 0)
  }

  expect(unwrap(sum)).toEqual(0)
  expect(unwrap(sum, 1)).toEqual(1)
  expect(unwrap(sum, 1, 2)).toEqual(3)
  expect(unwrap(sum, 1, 2, 3)).toEqual(6)
})
