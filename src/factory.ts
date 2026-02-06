import type { Linter } from 'eslint';

import { GLOB } from './glob.js';
import { javascript } from './javascript.js';
import { nextjs } from './next.js';
import { perfectionist } from './perfectionist.js';
import { react } from './react.js';
import { typescript } from './typescript.js';
import { unicorn } from './unicorn.js';
import { hasTsconfig, isPackageExists } from './utils.js';

export interface Config {
  env?: 'browser' | 'node' | 'both';
  ignores?: string[];
  overrides?: Linter.RulesRecord;
  perfectionist?: boolean;
  strict?: boolean;
  unicorn?: boolean;
}

export function config(
  options: Config = {},
  ...userConfigs: (Linter.Config | Linter.Config[])[]
): Linter.Config[] {
  const {
    env = 'both',
    ignores = [],
    overrides = {},
    unicorn: enableUnicorn = false,
    perfectionist: enablePerfectionist = false,
    strict: enableStrict = false
  } = options;

  const hasTypescript = isPackageExists('typescript');
  const hasReact = isPackageExists('react');
  const hasReactDom = isPackageExists('react-dom');
  const hasReactRefresh =
    isPackageExists('react-refresh') || isPackageExists('@vitejs/plugin-react');
  const hasNext = isPackageExists('next');
  const hasNextPlugin = isPackageExists('@next/eslint-plugin-next');

  if (hasNext && !hasNextPlugin) {
    console.warn(
      'Detected next but @next/eslint-plugin-next is missing; skipping Next.js rules.'
    );
  }

  const typeChecked = hasTypescript && hasTsconfig();

  const configs: Linter.Config[] = [
    {
      name: 'config/global-ignores',
      ignores: [...GLOB.EXCLUDE, ...ignores]
    },
    ...javascript({ env, strict: enableStrict }),
    ...(hasTypescript ? typescript({ typeChecked, strict: enableStrict }) : []),
    ...(hasReact
      ? react({
          env,
          includeA11y: hasReactDom,
          includeRefresh: hasReactRefresh
        })
      : []),
    ...(hasNext && hasNextPlugin ? nextjs() : []),
    ...(enableUnicorn ? unicorn() : []),
    ...(enablePerfectionist ? perfectionist() : [])
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
