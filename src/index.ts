import type { ConfigOptions } from './types'

export { mergeClashConfig, mergeClashConfigFile } from './merge'
export * from './types'

export function defineConfig(config: Partial<ConfigOptions>) {
  return config
}
