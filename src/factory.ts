/* eslint-disable unicorn/no-immediate-mutation */
/* eslint-disable unicorn/prefer-single-call */
import type { Linter } from 'eslint';

import { imports } from './configs/imports.js';
import { javascript } from './configs/javascript.js';
import { jsonc } from './configs/jsonc.js';
import { react } from './configs/react.js';
import { stylisticConfig } from './configs/stylistic.js';
import { typescript } from './configs/typescript.js';
import { unicorn } from './configs/unicorn.js';

export interface OptionsConfig {
  typescript?: boolean;
  stylistic?: boolean;
  unicorn?: boolean;
  react?: boolean;
  jsonc?: boolean;
  ignores?: string[];
}

export function fauziralpiandi(
  options: OptionsConfig = {},
  ...userConfigs: (Linter.Config | Linter.Config[])[]
): Linter.Config[] {
  const {
    typescript: enableTypescript = true,
    stylistic: enableStylistic = true,
    unicorn: enableUnicorn = true,
    react: enableReact = false,
    jsonc: enableJsonc = true,
    ignores = [],
  } = options;
  const configs: Linter.Config[] = [];

  configs.push({
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/package-lock.json',
      '**/yarn.lock',
      '**/pnpm-lock.yaml',
      '**/*.min.js',
      ...ignores,
    ],
  });
  configs.push(...javascript());
  configs.push(...imports());

  if (enableUnicorn) configs.push(...unicorn());
  if (enableTypescript) configs.push(...typescript());
  if (enableReact) configs.push(...react());
  if (enableJsonc) configs.push(...jsonc());
  if (enableStylistic) configs.push(...stylisticConfig());

  for (const config of userConfigs) {
    if (Array.isArray(config)) configs.push(...config);
    else configs.push(config);
  }

  return configs;
}
