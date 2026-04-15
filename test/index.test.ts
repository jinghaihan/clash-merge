import { describe, expect, it } from 'vitest'
import { mergeClashConfig } from '../src/merge'

describe('mergeClashConfig', () => {
  it('prepends configured rules and removes existing duplicates', () => {
    const rules = [
      'DOMAIN-SUFFIX,example.test,DIRECT',
      'DOMAIN-SUFFIX,internal.test,DIRECT',
    ]

    const result = mergeClashConfig(`
rules:
  - DOMAIN-SUFFIX,example.test,DIRECT
  - DOMAIN-SUFFIX,keep.com,Proxy
  - MATCH,Proxy
`, rules)

    expect(result.content).toContain(`rules:
  - DOMAIN-SUFFIX,example.test,DIRECT
  - DOMAIN-SUFFIX,internal.test,DIRECT
  - DOMAIN-SUFFIX,keep.com,Proxy
  - MATCH,Proxy
`)
    expect(result.totalRules).toBe(rules.length + 2)
  })
})
