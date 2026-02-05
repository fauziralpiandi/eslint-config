import type { Linter } from 'eslint';
import pluginUnicorn from 'eslint-plugin-unicorn';

import { GLOB } from './glob.js';

export function unicorn(): Linter.Config[] {
  const recommended = pluginUnicorn.configs.recommended;

  return [
    {
      name: 'config/unicorn/setup',
      files: GLOB.SRC,
      plugins: { unicorn: pluginUnicorn }
    },
    {
      name: 'config/unicorn/rules',
      files: GLOB.SRC,
      rules: {
        ...recommended.rules,
        'unicorn/filename-case': 'off',
        'unicorn/no-nested-ternary': 'off',
        'unicorn/no-array-reduce': 'off',
        'unicorn/no-null': 'off',
        'unicorn/prevent-abbreviations': 'off'
      }
    }
  ];
}
