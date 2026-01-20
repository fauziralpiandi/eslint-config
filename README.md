# @fauziralpiandi/eslint-config

Personal ESLint config. It's opinionated and handles pretty much everything for me.

## Install

```bash
pnpm add -D @fauziralpiandi/eslint-config
```

## Usage

```js
import config from '@fauziralpiandi/eslint-config';

export default config({
  ignores: [],
  overrides: {}
});
```

## What's in here?

It auto-detects your project setup and applies rules accordingly:

- **ESLint 9** modern flat config.
- **TypeScript** with type-checking enabled.
- **React** support (Hooks, Refresh, A11y).
- **Stylistic, Unicorn, & Perfectionist** for best practices.
- **Tailwind & Vitest** support.

## License

[MIT](LICENSE)
