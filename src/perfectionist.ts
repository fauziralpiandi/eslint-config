import type { Linter } from 'eslint';
import perfectionistPlugin from 'eslint-plugin-perfectionist';

import { GLOB } from './glob.js';

export function perfectionist(): Linter.Config[] {
  return [
    {
      name: 'config/perfectionist/rules',
      files: GLOB.SRC,
      plugins: {
        perfectionist: perfectionistPlugin
      },
      rules: {
        'perfectionist/sort-exports': [
          'warn',
          { order: 'asc', type: 'natural' }
        ],
        'perfectionist/sort-imports': [
          'warn',
          {
            groups: [
              ['builtin', 'external'],
              'internal',
              ['parent', 'sibling', 'index'],
              'side-effect',
              'unknown'
            ],
            newlinesBetween: 'ignore',
            order: 'asc',
            type: 'natural'
          }
        ],
        'perfectionist/sort-interfaces': [
          'warn',
          { order: 'asc', type: 'natural' }
        ],
        'perfectionist/sort-object-types': [
          'warn',
          { order: 'asc', type: 'natural' }
        ]
      }
    }
  ];
}
