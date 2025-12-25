# @fauziralpiandi/eslint-config

My personal, opinionated ESLint configuration for **JavaScript**, **TypeScript**, **React**, and **JSON**.

I built this to maintain a consistent "Versatile yet Strict" environment across my projects. It's designed for my own workflow, but feel free to use it if you share the same taste in code quality.

## Features

- **Smart Scoping**: Heavy TypeScript rules (`strictTypeChecked`) are strictly scoped to `.ts/.tsx` files. JS files remain safe.
- **Modern React**: Built-in support for React Hooks, JSX A11y, and modern React patterns (React 17+).
- **Stylistic**: Prettier-like formatting built-in via `@stylistic` (quotes, indents, semi, etc.) + `simple-import-sort`.
- **JSON & JSONC**: Auto-sorts `package.json`, `tsconfig.json`, and cleans up `.jsonc` files.
- **Unicorn**: Best practices and common sense rules from `eslint-plugin-unicorn`.
- **Pure ESM**: Bundled and optimized for modern Node.js projects.

## Installation

```bash
npm install -D @fauziralpiandi/eslint-config eslint
```

## Usage

Create `eslint.config.js` in your project root:

```javascript
import eslint from '@fauziralpiandi/eslint-config';

export default eslint(
  {
    // Enable/Disable specific features
    typescript: true,
    react: false,
    jsonc: true,
    stylistic: true,
    unicorn: true,

    // Global ignores
    ignores: ['dist', 'coverage'],
  },
  {
    // Custom overrides
    rules: {
      'no-console': 'warn',
    },
  },
);
```

## VS Code Setup

To get auto-fixing on save, add this to your `.vscode/settings.json`:

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "never"
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "json",
    "jsonc"
  ]
}
```

## Configuration Options

| Option       | Type       | Default | Description                                      |
| :----------- | :--------- | :------ | :----------------------------------------------- |
| `typescript` | `boolean`  | `true`  | Enable strict rules for TS files.                |
| `react`      | `boolean`  | `false` | Enable React, Hooks, and A11y rules.             |
| `jsonc`      | `boolean`  | `true`  | Enable JSON/JSONC linting (sorts package.json!). |
| `stylistic`  | `boolean`  | `true`  | Enable formatting rules.                         |
| `unicorn`    | `boolean`  | `true`  | Enable powerful best-practice rules.             |
| `ignores`    | `string[]` | `[]`    | Additional global ignore patterns.               |
