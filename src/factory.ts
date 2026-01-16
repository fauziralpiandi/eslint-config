import type { Linter } from 'eslint';

import { imports } from './configs/imports.js';
import { javascript } from './configs/javascript.js';
import { react } from './configs/react.js';
import { stylisticConfig } from './configs/stylistic.js';
import { typescript } from './configs/typescript.js';
import { unicorn } from './configs/unicorn.js';
import { GLOB } from './glob.js';

export interface OptionsConfig {
  typescript?: boolean;
  stylistic?: boolean;
  unicorn?: boolean;
  react?: boolean;
  ignores?: string[];
}

export function config(
  options: OptionsConfig = {},
  ...userConfigs: (Linter.Config | Linter.Config[])[]
): Linter.Config[] {
  const {
    typescript: enableTypescript = true,
    stylistic: enableStylistic = true,
    unicorn: enableUnicorn = true,
    react: enableReact = false,
    ignores = [],
  } = options;
  const configs: Linter.Config[] = [
    {
      ignores: [...GLOB.EXCLUDE, ...ignores],
    },
    ...javascript(),
    ...imports(),
  ];

  if (enableUnicorn) configs.push(...unicorn());
  if (enableTypescript) configs.push(...typescript());
  if (enableReact) configs.push(...react());
  if (enableStylistic) configs.push(...stylisticConfig());

  for (const config of userConfigs) {
    if (Array.isArray(config)) configs.push(...config);
    else configs.push(config);
  }

  return configs;
}
