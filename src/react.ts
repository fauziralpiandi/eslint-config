/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { fixupPluginRules } from '@eslint/compat';
import type { ESLint, Linter } from 'eslint';
import pluginJsxA11y from 'eslint-plugin-jsx-a11y';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

import { GLOB } from './glob.js';

export function react(): Linter.Config[] {
  return [
    {
      name: 'config/react/setup',
      files: GLOB.SRC,
      languageOptions: {
        globals: {
          ...globals.browser
        },
        parserOptions: {
          ecmaFeatures: {
            jsx: true
          }
        }
      },
      plugins: {
        'jsx-a11y': pluginJsxA11y as ESLint.Plugin,
        'react': pluginReact,
        'react-hooks': fixupPluginRules(pluginReactHooks as unknown as ESLint.Plugin),
        'react-refresh': pluginReactRefresh
      },
      settings: {
        react: {
          version: 'detect'
        }
      }
    },
    {
      name: 'config/react/rules',
      files: GLOB.SRC,
      rules: {
        ...pluginReact.configs.recommended.rules,
        ...pluginReact.configs['jsx-runtime'].rules,
        ...pluginReactHooks.configs.recommended.rules,
        ...pluginJsxA11y.configs.recommended.rules,
        'react/prop-types': 'off',
        'react/self-closing-comp': 'warn'
      }
    }
  ];
}
