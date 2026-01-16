# @fauziralpiandi/eslint-config

My personal, opinionated ESLint configuration for **JavaScript**, **TypeScript**, and **React**.

I built this to maintain a consistent "Versatile yet Balanced" environment across my projects. It's designed for my own workflow, but feel free to use it if you share the same taste in code quality.

## Features

- **Smart Scoping**: TypeScript rules (`recommendedTypeChecked`) are strictly scoped to `.ts/.tsx` files. JS files remain safe and light.
- **Modern React**: Optional support for React Hooks, JSX A11y, and modern React patterns (React 17+).
- **Stylistic**: Prettier-like formatting built-in via `@stylistic` (2 spaces, single quotes, semi) + `simple-import-sort`.
- **Unicorn**: Best practices and common sense rules from `eslint-plugin-unicorn` (Recommended preset).
- **Pure ESM**: Bundled and optimized for modern Node.js projects.

## Installation

```bash
npm i -D @fauziralpiandi/eslint-config
```

## Usage

Create `eslint.config.js` in your project root:

```javascript
import config from '@fauziralpiandi/eslint-config';

export default config(
  {
    // Enable/Disable specific features
    typescript: true, // Default
    react: false, // Default
    stylistic: true, // Default
    unicorn: true, // Default

    // Global ignores
    ignores: ['custom-folder/**'],
  },
  {
    // Custom overrides
    rules: {
      'no-console': 'warn',
    },
  },
);
```

## Configuration Options

| Option       | Type       | Default | Description                             |
| :----------- | :--------- | :------ | :-------------------------------------- |
| `typescript` | `boolean`  | `true`  | Enable recommended rules for TS files.  |
| `react`      | `boolean`  | `false` | Enable React, Hooks, and A11y rules.    |
| `stylistic`  | `boolean`  | `true`  | Enable formatting rules via @stylistic. |
| `unicorn`    | `boolean`  | `true`  | Enable powerful best-practice rules.    |
| `ignores`    | `string[]` | `[]`    | Additional global ignore patterns.      |

## License

MIT
