import type { UserConfigExport } from './types'

export { mergeClashConfig, mergeClashConfigFile } from './merge'
export * from './types'

export function defineConfig<T extends UserConfigExport>(config: T): T {
  return config
}
