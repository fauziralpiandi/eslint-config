import type { Linter } from 'eslint';
import pluginVitest from 'eslint-plugin-vitest';

import { GLOB } from './glob.js';

export function vitest(): Linter.Config[] {
  return [
    {
      name: 'config/vitest/setup',
      files: GLOB.MISC,
      plugins: {
        vitest: pluginVitest
      }
    },
    {
      name: 'config/vitest/rules',
      files: GLOB.MISC,
      rules: {
        ...pluginVitest.configs.recommended.rules,
        'vitest/consistent-test-it': ['error', { fn: 'it', withinDescribe: 'it' }],
        'vitest/no-conditional-expect': 'error',
        'vitest/no-standalone-expect': 'error',
        'vitest/prefer-hooks-in-order': 'error',
        'vitest/prefer-lowercase-title': 'warn',
        'vitest/prefer-to-be-falsy': 'warn',
        'vitest/prefer-to-be-object': 'warn',
        'vitest/prefer-to-be-truthy': 'warn',
        'vitest/prefer-to-contain': 'warn',
        'vitest/prefer-to-have-length': 'warn'
      }
    }
  ];
}
