import type { UserConfig, UserConfigFunction } from '../types'

export function defineConfig(
  options: UserConfig | UserConfig[] | UserConfigFunction
): UserConfig | UserConfig[] | UserConfigFunction {
  return options
}
