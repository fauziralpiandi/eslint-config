# @fauziralpiandi/eslint-config

Personal ESLint baseline for my own projects. Shared here in case it's useful.

## Install

```bash
pnpm add -D @fauziralpiandi/eslint-config
```

> [!NOTE]
>
> Requires `eslint` ^9.
> TypeScript configs require `typescript` >=5.

## Usage

```js
import config from "@fauziralpiandi/eslint-config";

export default config({
  // env: "node" | "browser" | "worker",
  // ignores: [],
  // strict: false,
  // overrides: []
});
```

Optional: append extra configs if needed.

```js
import config from "@fauziralpiandi/eslint-config";

export default config(
  {
    env: "node"
  },
  {
    name: "project/custom",
    rules: {
      "no-console": "warn"
    }
  }
);
```

## Contents

- ESLint 9 flat config.
- `@eslint/js` recommended rules.
- TypeScript configs from `typescript-eslint` when `typescript` is installed (skipped otherwise).
- Type-checked configs when a `tsconfig*.json` (including `.jsonc`/`.json5`) file exists in the project root.

## Options

- `env`: `"node" | "browser" | "worker" | Array<"node" | "browser" | "worker">`
  Defaults to all. Applies globally to JS and TS configs.
- `ignores`: `string[]`
  Global ignore patterns. Defaults to a list of common build outputs and caches.
- `strict`: `boolean`
  Uses `typescript-eslint` strict configs when available (no JS strict preset applied).
- `overrides`: `Config[]`
  Additional flat configs inserted before any user-provided configs. The type can be imported from this package:

  ```ts
  import type { Config } from "@fauziralpiandi/eslint-config";
  ```

## License

[MIT](LICENSE)
