# @fauziralpiandi/eslint-config

Personal ESLint baseline for my own projects.

## Install

```bash
pnpm add -D @fauziralpiandi/eslint-config
```

> [!NOTE]
>
> Requires `eslint: ^9`, and TypeScript configs need `typescript: >=5`.

## Usage

```js
import config from "@fauziralpiandi/eslint-config";

export default config({
  // env: "node",
  // ignores: [],
  // strict: false,
  // stylistic: false,
  // project: false | ["./tsconfig.json"],
  // overrides: []
});
```

## Contents

- ESLint 9 flat config.
- `@eslint/js` recommended rules.
- TypeScript configs via `typescript-eslint` when `typescript` is installed (skips if not).
- Type-checked configs when a `tsconfig*.json` (including `.jsonc`/`.json5`) is in the project root,
  unless you override with the `project` option.

## Options

- `env`: `"node" | "browser" | "worker" | Array<"node" | "browser" | "worker">`
  Defaults to `"node"`. Applies globally to JS and TS configs.
- `ignores`: `string[]`
  Global ignore patterns. Defaults to a list of common build outputs and caches.
- `strict`: `boolean`
  Increases TypeScript correctness by using `typescript-eslint` strict configs
  when available (no JS strict preset applied).
- `stylistic`: `boolean`
  Adds TypeScript stylistic rules (type-checked when a `tsconfig` is present).
- `project`: `string[] | false`
  Overrides type-checked detection. Use `false` to force non-type-checked configs even if
  a `tsconfig` exists, or pass `tsconfig` paths to force type-checked configs.
- `overrides`: `Config[]`
  Extra flat configs inserted before any user-provided configs. The type can be imported from this package:

  ```ts
  import type { Config } from "@fauziralpiandi/eslint-config";
  ```

## License

[MIT](LICENSE)
