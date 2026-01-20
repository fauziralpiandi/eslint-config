import stylisticPlugin from '@stylistic/eslint-plugin';
import type { Linter } from 'eslint';

import { GLOB } from './glob.js';

export function stylistic(): Linter.Config[] {
  return [
    {
      name: 'config/stylistic/rules',
      files: GLOB.SRC,
      plugins: {
        '@stylistic': stylisticPlugin
      },
      rules: {
        ...stylisticPlugin.configs.customize({
          braceStyle: '1tbs',
          commaDangle: 'never',
          semi: true
        }).rules
      }
    }
  ];
}
