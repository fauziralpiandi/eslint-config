# @fauziralpiandi/eslint-config

Personal ESLint baseline for my own tooling. It's focused on correctness with a few optional extras; if you want to try it, feel free.

## Install

```bash
pnpm add -D @fauziralpiandi/eslint-config
```

## Usage

```js
import config from '@fauziralpiandi/eslint-config';

export default config({
  // ignores: [],
  // overrides: {},
  // env: 'node',
  // perfectionist: true,
  // strict: true,
  // unicorn: true
});
```

## What's in here?

Minimal, logic-focused baseline that works across projects:

- **ESLint 9** modern flat config.
- **Core correctness rules** from `@eslint/js` recommended.
- **TypeScript** baseline rules, auto-upgrade to type-checked when `tsconfig` is present.
- **React** rules auto-enabled when `react` is detected (a11y only with `react-dom`, refresh only with Vite/React Refresh).
- **Next.js** recommended + core web vitals rules auto-enabled when `next` and `@next/eslint-plugin-next` are detected.

Optional flags:

- `env: 'browser' | 'node' | 'both'` to set global environments (default: `both`, applies to JS and React configs).
- `perfectionist: true` to enable `eslint-plugin-perfectionist`
- `strict: true` to tighten JS rules (warn → error) and use `strictTypeChecked` when `tsconfig` is present
- `unicorn: true` to enable `eslint-plugin-unicorn`

## License

[MIT](LICENSE)
