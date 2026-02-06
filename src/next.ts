import type { ESLint, Linter } from 'eslint';
import { createRequire } from 'node:module';

import { GLOB } from './glob.js';

const require = createRequire(import.meta.url);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

export function nextjs(pluginOverride?: ESLint.Plugin): Linter.Config[] {
  const pluginNext =
    pluginOverride ?? (require('@next/eslint-plugin-next') as unknown);
  const hasDefault =
    !pluginOverride &&
    typeof pluginNext === 'object' &&
    pluginNext !== null &&
    'default' in pluginNext;
  const plugin = hasDefault
    ? (pluginNext as { default: ESLint.Plugin }).default
    : (pluginNext as ESLint.Plugin);

  const mergeConfigs = (
    configs: unknown[]
  ): {
    languageOptions?: Record<string, unknown>;
    rules: Linter.RulesRecord;
    settings?: Record<string, unknown>;
  } => {
    const result: {
      languageOptions?: Record<string, unknown>;
      rules: Linter.RulesRecord;
      settings?: Record<string, unknown>;
    } = { rules: {} };

    const merge = (config: unknown) => {
      if (!config || typeof config !== 'object') return;

      const typed = config as {
        languageOptions?: unknown;
        rules?: Linter.RulesRecord;
        settings?: unknown;
      };

      if (typed.rules) result.rules = { ...result.rules, ...typed.rules };
      if (isRecord(typed.settings)) {
        result.settings = {
          ...result.settings,
          ...typed.settings
        };
      }
      if (isRecord(typed.languageOptions)) {
        result.languageOptions = {
          ...result.languageOptions,
          ...typed.languageOptions
        };
      }
    };

    for (const config of configs) {
      if (Array.isArray(config)) {
        for (const item of config) merge(item);
      } else {
        merge(config);
      }
    }

    return result;
  };

  const merged = mergeConfigs([
    plugin.configs?.recommended,
    plugin.configs?.['core-web-vitals']
  ]);

  return [
    {
      name: 'config/nextjs/setup',
      files: GLOB.SRC,
      plugins: {
        '@next/next': plugin
      }
    },
    {
      name: 'config/nextjs/rules',
      files: GLOB.SRC,
      rules: {
        ...merged.rules
      },
      ...(merged.settings ? { settings: merged.settings } : {}),
      ...(merged.languageOptions
        ? { languageOptions: merged.languageOptions }
        : {})
    }
  ];
}
