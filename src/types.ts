export interface CommandOptions {
  cwd?: string
  source?: string
  output?: string
}

export interface ConfigOptions extends CommandOptions {
  rules?: string[]
}

export type UserConfig = Partial<ConfigOptions>

export type UserConfigArray = UserConfig[]

export type UserConfigExport = UserConfig | UserConfigArray

export interface ResolvedOptions extends Required<CommandOptions>, Required<Pick<ConfigOptions, 'rules'>> {

}

export type Options = ResolvedOptions[]

export interface MergeResult {
  source: string
  output: string
  content: string
  insertedRules: string[]
  totalRules: number
}
