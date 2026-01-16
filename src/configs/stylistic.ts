import stylistic from '@stylistic/eslint-plugin';
import type { Linter } from 'eslint';

export function stylisticConfig(): Linter.Config[] {
  return [
    {
      name: 'config/stylistic/rules',
      plugins: {
        '@stylistic': stylistic,
      },
      rules: {
        ...stylistic.configs.customize({
          indent: 2,
          quotes: 'single',
          semi: true,
          jsx: true,
        }).rules,
      },
    },
  ];
}
