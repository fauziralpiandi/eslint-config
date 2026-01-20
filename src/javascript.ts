import pluginJs from '@eslint/js';
import type { Linter } from 'eslint';
import globals from 'globals';

import { GLOB } from './glob.js';

export function javascript(): Linter.Config[] {
  return [
    {
      name: 'config/javascript/setup',
      files: GLOB.SRC,
      languageOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        globals: {
          ...globals.browser,
          ...globals.es2021,
          ...globals.node
        },
        parserOptions: {
          ecmaFeatures: {
            jsx: true
          }
        }
      }
    },
    {
      name: 'config/javascript/rules',
      files: GLOB.SRC,
      rules: {
        ...pluginJs.configs.recommended.rules,
        'no-console': 'off',
        'no-debugger': 'warn',
        'no-empty': 'warn',
        'no-unused-vars': 'warn'
      }
    }
  ];
}
