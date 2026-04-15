import type { MergeResult, Options } from './types'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { basename, dirname, isAbsolute, resolve } from 'node:path'
import process from 'node:process'
import { parse, stringify } from 'yaml'

type ClashConfig = Record<string, unknown> & {
  rules?: unknown
}

export async function mergeClashConfigFile(options: Options): Promise<MergeResult> {
  const cwd = resolve(options.cwd || process.cwd())
  const source = resolvePath(cwd, options.source, 'Missing source path. Pass --source or set source in clash-merge.config.ts.')
  const output = resolvePath(cwd, options.output, 'Missing output path. Pass --output or set output in clash-merge.config.ts.')
  const rules = readConfiguredRules(options.rules)

  if (source === output)
    throw new Error('Output must be different from source to avoid overwriting the subscription file.')

  const sourceContent = await readFile(source, 'utf8')
  const result = mergeClashConfig(sourceContent, rules)

  await writeFileAtomic(output, result.content)

  return {
    source,
    output,
    content: result.content,
    insertedRules: rules,
    totalRules: result.totalRules,
  }
}

export function mergeClashConfig(sourceContent: string, rules: string[]): Pick<MergeResult, 'content' | 'totalRules'> {
  const config = parseClashConfig(sourceContent)
  const existingRules = readRules(config)
  const mergedRules = mergeRules(existingRules, rules)

  config.rules = mergedRules

  return {
    content: stringify(config, { lineWidth: 0 }),
    totalRules: mergedRules.length,
  }
}

function parseClashConfig(sourceContent: string): ClashConfig {
  const parsed = parse(sourceContent)
  if (!isRecord(parsed))
    throw new TypeError('Source YAML must be a mapping object.')

  return parsed as ClashConfig
}

function readRules(config: ClashConfig) {
  if (!Array.isArray(config.rules))
    throw new TypeError('Source YAML must contain a rules array.')

  for (const rule of config.rules) {
    if (typeof rule !== 'string')
      throw new TypeError('All rules must be strings.')
  }

  return config.rules
}

function readConfiguredRules(rules: string[]) {
  const normalizedRules = uniqueRules(rules)

  if (!normalizedRules.length)
    throw new Error('Missing rules. Set rules in clash-merge.config.ts.')

  return normalizedRules
}

function mergeRules(existingRules: string[], rules: string[]) {
  const ruleSet = new Set(rules.map(normalizeRule))
  const subscriptionRules = existingRules.filter(rule => !ruleSet.has(normalizeRule(rule)))

  return [...rules, ...subscriptionRules]
}

function uniqueRules(rules: string[]) {
  const seen = new Set<string>()
  const result: string[] = []

  for (const rule of rules) {
    const normalized = normalizeRule(rule)
    if (seen.has(normalized))
      continue

    seen.add(normalized)
    result.push(rule)
  }

  return result
}

function normalizeRule(rule: string) {
  return rule.trim()
}

function resolvePath(cwd: string, path?: string, missingMessage?: string) {
  if (!path)
    throw new Error(missingMessage || 'Missing path.')

  return isAbsolute(path) ? path : resolve(cwd, path)
}

async function writeFileAtomic(filePath: string, content: string) {
  await mkdir(dirname(filePath), { recursive: true })

  const temporaryPath = resolve(
    dirname(filePath),
    `.${basename(filePath)}.${process.pid}.${Date.now()}.tmp`,
  )

  await writeFile(temporaryPath, content, 'utf8')
  await rename(temporaryPath, filePath)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}
