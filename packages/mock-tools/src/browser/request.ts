import Mock, { MockCbOptions } from 'better-mock'
import { match, MatchResult } from 'path-to-regexp'

/**
 * 模拟请求回调函数
 *
 * @public
 */
export type MockCb = (req: MockRequest) => unknown

/**
 * 请求对象
 *
 * @public
 */
export interface MockRequest {
  url: string
  path: string
  query: Record<string, string>
  params: Record<string, string>
  body?: string | null
}

/**
 * 解析请求参数
 *
 * @param sp - URLSearchParams 实例
 * @returns 请求参数
 */
function parseQuery(sp: URLSearchParams): Record<string, string> {
  const query: Record<string, string> = {}

  for (const [key, value] of sp.entries()) {
    query[key] = value
  }

  return query
}

/**
 * 模拟请求
 *
 * @public
 * @param type      - 类型
 * @param callback  - 回调函数
 */
export function mockHttpRequest(rule: string, callback: MockCb): void

/**
 * 模拟请求
 *
 * @public
 * @param rule      - 路由规则
 * @param type      - 类型
 * @param callback  - 回调函数
 */
export function mockHttpRequest(
  rule: string,
  type: string,
  callback: MockCb
): void
export function mockHttpRequest(rule: string, ...args: unknown[]): void {
  const parse = match(rule)
  const callback = args.pop() as MockCb

  function handler(options: MockCbOptions) {
    const url = new URL(options.url, window.location.origin)
    const path = url.pathname
    const parsed = parse(path) as MatchResult<Record<string, string>>

    return callback({
      url: url.toString(),
      path: path,
      query: parseQuery(url.searchParams),
      params: parsed['params'] || {},
      body: options['body'],
    })
  }

  Mock.mock(rule, args.concat(handler))
}
