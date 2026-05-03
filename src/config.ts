import type { CommandOptions, Options, ResolvedOptions, UserConfigExport } from './types'
import process from 'node:process'
import { createConfigLoader } from 'unconfig'
import { DEFAULT_OPTIONS } from './constants'

interface DefaultExportedConfig {
  default?: UserConfigExport
}

function normalizeConfig(options: UserConfigExport | DefaultExportedConfig) {
  // interop
  if (isRecord(options) && 'default' in options)
    return options.default || {}

  return options
}

export async function readConfig(options: Partial<CommandOptions>) {
  const loader = createConfigLoader<UserConfigExport>({
    sources: [
      {
        files: ['clash-merge.config'],
        extensions: ['ts'],
      },
    ],
    cwd: options.cwd || process.cwd(),
    merge: false,
  })
  const config = await loader.load()
  return config.sources.length ? normalizeConfig(config.config) : {}
}

export async function resolveConfig(options: Partial<CommandOptions>): Promise<Options> {
  const defaults = { ...DEFAULT_OPTIONS }

  const configOptions = await readConfig(options)

  return toArray(configOptions).map(config => ({
    ...defaults,
    ...config,
    ...options,
  }) as ResolvedOptions)
}

function toArray<T>(value: T | T[]) {
  return Array.isArray(value) ? value : [value]
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}
