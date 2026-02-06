import pluginJs from '@eslint/js';
import type { Linter } from 'eslint';
import globals from 'globals';

import { GLOB } from './glob.js';

interface JavascriptOptions {
  env: 'browser' | 'node' | 'both';
  strict: boolean;
}

export function javascript(options: JavascriptOptions): Linter.Config[] {
  const recommendedRules = pluginJs.configs.recommended.rules;
  const strictRules: Linter.RulesRecord = options.strict
    ? {
        'no-console': 'warn',
        'no-constant-condition': 'error',
        'no-debugger': 'error',
        'no-empty': 'error',
        'no-implicit-coercion': 'error',
        'no-unused-vars': 'error'
      }
    : {
        'no-console': 'off',
        'no-constant-condition': 'warn',
        'no-debugger': 'warn',
        'no-empty': 'warn',
        'no-implicit-coercion': 'warn',
        'no-unused-vars': 'warn'
      };

  const baseOverrides: Linter.RulesRecord = {
    eqeqeq: 'error',
    'no-return-assign': 'error',
    ...strictRules
  };

  const overrides: Linter.RulesRecord = {};

  for (const [name, value] of Object.entries(baseOverrides)) {
    if (recommendedRules[name] !== value) {
      overrides[name] = value;
    }
  }

  const envGlobals =
    options.env === 'browser'
      ? globals.browser
      : options.env === 'node'
        ? globals.node
        : { ...globals.browser, ...globals.node };

  return [
    {
      name: 'config/javascript/setup',
      files: GLOB.JS,
      languageOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        globals: {
          ...globals.es2021,
          ...envGlobals
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
        ...recommendedRules,
        ...overrides
      }
    }
  ];
}
