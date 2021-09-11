import { rollup } from 'rollup'
import onExit from 'signal-exit'

import type { BuildContext, MergedUserConfig } from '../types'
import { getRollupConfig } from './getRollupConfig'

export default async function build(
  ctx: BuildContext,
  userConfig: MergedUserConfig
): Promise<void> {
  const options = getRollupConfig(ctx, userConfig)

  const outputOptions = options.output
  const bundle = await rollup(options)

  onExit(close)

  process.on('uncaughtException', close)
  if (!process.stdin.isTTY) {
    process.stdin.on('end', close)
    process.stdin.resume()
  }

  function close(code: number | null) {
    process.removeListener('uncaughtException', close)
    // removing a non-existent listener is a no-op
    process.stdin.removeListener('end', close)

    if (bundle) bundle.close()
    if (code) process.exit(code)
  }

  await Promise.all(outputOptions.map(bundle.write))
  await bundle.close()
}
