import type { Linter } from 'eslint';

import { GLOB } from './glob.js';
import { javascript } from './javascript.js';
import { perfectionist } from './perfectionist.js';
import { react } from './react.js';
import { stylistic } from './stylistic.js';
import { tailwind } from './tailwind.js';
import { typescript } from './typescript.js';
import { unicorn } from './unicorn.js';
import { isPackageExists } from './utils.js';
import { vitest } from './vitest.js';

export interface Config {
  ignores?: string[];
  overrides?: Linter.RulesRecord;
}

export function config(
  options: Config = {},
  ...userConfigs: (Linter.Config | Linter.Config[])[]
): Linter.Config[] {
  const isTypescript = isPackageExists('typescript');
  const isVitest = isPackageExists('vitest');
  const isReact = isPackageExists('react');
  // tailwind v4 is built different,
  // skipping rules for now to avoid the crash.
  const isTailwindPkg = isPackageExists('tailwindcss');
  const isTailwindLegacy = isPackageExists('tailwindcss/resolveConfig');
  const isTailwind = isTailwindPkg && isTailwindLegacy;

  if (isTailwindPkg && !isTailwindLegacy) {
    console.warn(
      '[@fauziralpiandi/eslint-config] Disabling Tailwind rules as `eslint-plugin-tailwindcss` is not yet compatible for Tailwind v4.'
    );
  }

  const { ignores = [], overrides = {} } = options;

  const configs: Linter.Config[] = [
    {
      name: 'config/global-ignores',
      ignores: [...GLOB.EXCLUDE, ...ignores]
    },
    ...javascript(),
    ...perfectionist(),
    ...stylistic(),
    ...unicorn(),
    ...(isTypescript ? typescript() : []),
    ...(isVitest ? vitest() : []),
    ...(isReact ? react() : []),
    ...(isTailwind ? tailwind() : [])
  ];

  if (Object.keys(overrides).length > 0) {
    configs.push({
      name: 'config/global-overrides',
      rules: overrides
    });
  }

  for (const config of userConfigs) {
    if (Array.isArray(config)) configs.push(...config);
    else configs.push(config);
  }

  return configs;
}
