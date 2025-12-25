import pluginJs from '@eslint/js';
import type { Linter } from 'eslint';
import globals from 'globals';

export function javascript(): Linter.Config[] {
  return [
    {
      name: 'fauziralpiandi/javascript/setup',
      languageOptions: {
        globals: {
          ...globals.browser,
          ...globals.es2021,
          ...globals.node,
        },
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
          ecmaVersion: 2022,
          sourceType: 'module',
        },
      },
    },
    {
      name: 'fauziralpiandi/javascript/rules',
      ...pluginJs.configs.recommended,
    },
  ];
}
