import type { Linter } from 'eslint';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';

export function unicorn(): Linter.Config[] {
  return [
    {
      name: 'fauziralpiandi/unicorn/rules',
      plugins: {
        unicorn: eslintPluginUnicorn,
      },
      rules: {
        ...eslintPluginUnicorn.configs.recommended.rules,
        'unicorn/prevent-abbreviations': 'off',
        'unicorn/filename-case': 'off',
        'unicorn/no-null': 'off',
        'unicorn/no-useless-undefined': 'off',
        'unicorn/prefer-module': 'off', // we handle modules via typescript/esm
      },
    },
  ];
}
