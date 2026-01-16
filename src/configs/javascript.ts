import pluginJs from '@eslint/js';
import type { Linter } from 'eslint';
import globals from 'globals';

export function javascript(): Linter.Config[] {
  return [
    {
      name: 'config/javascript/setup',
      languageOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        globals: {
          ...globals.browser,
          ...globals.es2021,
          ...globals.node,
        },
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
      },
    },
    {
      name: 'config/javascript/rules',
      ...pluginJs.configs.recommended,
    },
  ];
}
