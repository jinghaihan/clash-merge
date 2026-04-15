export interface CommandOptions {
  cwd?: string
  source?: string
  output?: string
}

export interface ConfigOptions extends CommandOptions {
  rules?: string[]
}

export interface Options extends Required<CommandOptions>, Required<Pick<ConfigOptions, 'rules'>> {

}

export interface MergeResult {
  source: string
  output: string
  content: string
  insertedRules: string[]
  totalRules: number
}
