import { mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { resolveConfig } from '../src/config'

describe('resolveConfig', () => {
  it('wraps a single config object in an array', async () => {
    const cwd = await createFixture(`
export default {
  source: 'subscription.yaml',
  output: 'merged.yaml',
  rules: ['DOMAIN-SUFFIX,example.test,DIRECT'],
}
`)

    await expect(resolveConfig({ cwd })).resolves.toEqual([
      {
        cwd,
        source: 'subscription.yaml',
        output: 'merged.yaml',
        rules: ['DOMAIN-SUFFIX,example.test,DIRECT'],
      },
    ])
  })

  it('resolves array configs as multiple options entries', async () => {
    const cwd = await createFixture(`
export default [
  {
    source: 'primary.yaml',
    output: 'primary.merged.yaml',
    rules: ['DOMAIN-SUFFIX,primary.test,DIRECT'],
  },
  {
    source: 'backup.yaml',
    output: 'backup.merged.yaml',
    rules: ['DOMAIN-SUFFIX,backup.test,DIRECT'],
  },
]
`)

    await expect(resolveConfig({ cwd })).resolves.toEqual([
      {
        cwd,
        source: 'primary.yaml',
        output: 'primary.merged.yaml',
        rules: ['DOMAIN-SUFFIX,primary.test,DIRECT'],
      },
      {
        cwd,
        source: 'backup.yaml',
        output: 'backup.merged.yaml',
        rules: ['DOMAIN-SUFFIX,backup.test,DIRECT'],
      },
    ])
  })
})

async function createFixture(config: string) {
  const cwd = await mkdtemp(join(tmpdir(), 'clash-merge-'))
  await writeFile(join(cwd, 'clash-merge.config.ts'), config, 'utf8')
  return cwd
}
