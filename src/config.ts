import type { CommandOptions, ConfigOptions, Options } from './types'
import process from 'node:process'
import { createConfigLoader } from 'unconfig'
import { DEFAULT_OPTIONS } from './constants'

function normalizeConfig(options: Partial<Options>) {
  // interop
  if ('default' in options)
    options = options.default as Partial<Options>

  return options
}

export async function readConfig(options: Partial<CommandOptions>) {
  const loader = createConfigLoader<ConfigOptions>({
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
  options = normalizeConfig(options)

  const configOptions = await readConfig(options)
  const merged = { ...defaults, ...configOptions, ...options }

  return merged as Options
}
