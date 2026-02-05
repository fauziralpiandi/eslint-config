import pluginJs from '@eslint/js';
import type { Linter } from 'eslint';
import globals from 'globals';

import { GLOB } from './glob.js';

interface JavascriptOptions {
  strict: boolean;
}

export function javascript(options: JavascriptOptions): Linter.Config[] {
  const strictRules: Linter.RulesRecord = options.strict
    ? {
        'no-console': 'warn',
        'no-implicit-coercion': 'error'
      }
    : {
        'no-console': 'off',
        'no-constant-condition': 'warn',
        'no-debugger': 'warn',
        'no-empty': 'warn',
        'no-implicit-coercion': 'warn',
        'no-unused-vars': 'warn'
      };

  return [
    {
      name: 'config/javascript/setup',
      files: GLOB.JS,
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
      files: GLOB.JS,
      rules: {
        ...pluginJs.configs.recommended.rules,
        eqeqeq: 'error',
        'no-return-assign': 'error',
        ...strictRules
      }
    }
  ];
}
