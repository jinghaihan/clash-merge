# clash-merge

[![npm version][npm-version-src]][npm-version-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

## Usage

Generate a final Clash config from the subscription YAML plus configured rules:

```bash
clash-merge \
  --source ~/.config/clash/subscription.yaml \
  --output ~/.config/clash/subscription.merged.yaml
```

## Configuration

Create `clash-merge.config.ts`:

```ts
import { defineConfig } from 'clash-merge'

export default defineConfig({
  source: '/Users/jinghaihan/.config/clash/subscription.yaml',
  output: '/Users/jinghaihan/.config/clash/subscription.merged.yaml',
  rules: [
    'DOMAIN-SUFFIX,example.test,DIRECT',
    'DOMAIN-SUFFIX,internal.test,DIRECT',
  ],
})
```

Then point Clash at the generated `subscription.merged.yaml` file.

## License

[MIT](./LICENSE) License © [jinghaihan](https://github.com/jinghaihan)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/clash-merge?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/clash-merge
[npm-downloads-src]: https://img.shields.io/npm/dm/clash-merge?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/clash-merge
[bundle-src]: https://img.shields.io/bundlephobia/minzip/clash-merge?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=clash-merge
[license-src]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/jinghaihan/clash-merge/LICENSE
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=1fa669
[jsdocs-href]: https://www.jsdocs.io/package/clash-merge
