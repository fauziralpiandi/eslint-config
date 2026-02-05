import type { Linter } from 'eslint';

import { GLOB } from './glob.js';
import { javascript } from './javascript.js';
import { perfectionist } from './perfectionist.js';
import { react } from './react.js';
import { typescript } from './typescript.js';
import { unicorn } from './unicorn.js';
import { hasTsconfig, isPackageExists } from './utils.js';

export interface Config {
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

  const typeChecked = hasTypescript && hasTsconfig();

  const configs: Linter.Config[] = [
    {
      name: 'config/global-ignores',
      ignores: [...GLOB.EXCLUDE, ...ignores]
    },
    ...javascript({ strict: enableStrict }),
    ...(hasTypescript ? typescript({ typeChecked, strict: enableStrict }) : []),
    ...(hasReact
      ? react({
          includeA11y: hasReactDom,
          includeRefresh: hasReactRefresh
        })
      : []),
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
