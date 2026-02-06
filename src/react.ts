/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { fixupPluginRules } from '@eslint/compat';
import type { ESLint, Linter } from 'eslint';
import pluginJsxA11y from 'eslint-plugin-jsx-a11y';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

import { GLOB } from './glob.js';
import { filterRuleOverrides } from './rules.js';

interface ReactOptions {
  env: 'browser' | 'node' | 'both';
  includeA11y: boolean;
  includeRefresh: boolean;
}

export function react(options: ReactOptions): Linter.Config[] {
  const envGlobals =
    options.env === 'browser'
      ? globals.browser
      : options.env === 'node'
        ? globals.node
        : { ...globals.browser, ...globals.node };
  const baseRules: Linter.RulesRecord = {
    ...pluginReact.configs.recommended.rules,
    ...pluginReact.configs['jsx-runtime'].rules,
    ...pluginReactHooks.configs.recommended.rules,
    ...(options.includeA11y ? pluginJsxA11y.configs.recommended.rules : {}),
    ...(options.includeRefresh
      ? pluginReactRefresh.configs.recommended.rules
      : {})
  };

  const overrideRules = filterRuleOverrides(baseRules, {
    'react/prop-types': 'off',
    'react/self-closing-comp': 'warn'
  });

  return [
    {
      name: 'config/react/setup',
      files: GLOB.REACT,
      languageOptions: {
        globals: {
          ...envGlobals
        },
        parserOptions: {
          ecmaFeatures: {
            jsx: true
          }
        }
      },
      plugins: {
        react: pluginReact,
        'react-hooks': fixupPluginRules(
          pluginReactHooks as unknown as ESLint.Plugin
        ),
        ...(options.includeA11y
          ? { 'jsx-a11y': pluginJsxA11y as ESLint.Plugin }
          : {}),
        ...(options.includeRefresh
          ? { 'react-refresh': pluginReactRefresh }
          : {})
      },
      settings: {
        react: {
          version: 'detect'
        }
      }
    },
    {
      name: 'config/react/rules',
      files: GLOB.REACT,
      rules: {
        ...baseRules,
        ...overrideRules
      }
    }
  ];
}
