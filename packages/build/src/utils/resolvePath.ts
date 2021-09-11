export function resolvePath(
  path: string,
  data: Record<string, string>
): string {
  function replacer(_: string, key: string): string {
    return data.hasOwnProperty(key) ? data[key]! : ''
  }
  return path
    .replace(/\<([^\<\>]+)\>/g, replacer)
    .replace(/\[([^\[\]]+)\]/g, replacer)
}
