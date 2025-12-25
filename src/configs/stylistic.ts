import stylistic from '@stylistic/eslint-plugin';
import type { Linter } from 'eslint';

export function stylisticConfig(): Linter.Config[] {
  return [
    {
      name: 'fauziralpiandi/stylistic/rules',
      plugins: {
        '@stylistic': stylistic,
      },
      rules: {
        ...(
          stylistic.configs.customize({
            indent: 2,
            quotes: 'single',
            semi: true,
            jsx: true,
          }) as any
        ).rules,
        '@stylistic/array-bracket-newline': ['error', 'consistent'],
        '@stylistic/object-curly-newline': ['error', { consistent: true }],
      },
    },
  ];
}
