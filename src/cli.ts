import type { CAC } from 'cac'
import type { CommandOptions } from './types'
import process from 'node:process'
import * as p from '@clack/prompts'
import c from 'ansis'
import { cac } from 'cac'
import { resolveConfig } from './config'
import { NAME, VERSION } from './constants'
import { mergeClashConfigFile } from './merge'

try {
  const cli: CAC = cac(NAME)

  cli
    .command('', 'Merge local rules into a Clash YAML config')
    .option('--cwd <dir>', 'Working directory for relative paths')
    .option('-s, --source <path>', 'Source subscription YAML path')
    .option('-o, --output <path>', 'Output merged YAML path')
    .action(async (options: Partial<CommandOptions>) => {
      p.intro(`${c.yellow`${NAME} `}${c.dim`v${VERSION}`}`)
      const configs = await resolveConfig(options)
      const results = await Promise.all(configs.map(config => mergeClashConfigFile(config)))

      if (results.length === 1) {
        const [result] = results
        p.outro(`Merged ${c.yellow(result.insertedRules.length)} rule(s) to ${result.output}`)
      }
      else {
        const mergedFiles = results.map(result => c.dim(result.output)).join('\n')
        p.outro(`Merged ${c.yellow(results.length)} config(s):\n${mergedFiles}`)
      }
    })

  cli.help()
  cli.version(VERSION)
  cli.parse()
}
catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
}
