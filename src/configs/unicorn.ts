import type { Linter } from 'eslint';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';

export function unicorn(): Linter.Config[] {
  return [
    {
      name: 'config/unicorn/rules',
      plugins: {
        unicorn: eslintPluginUnicorn,
      },
      rules: {
        ...eslintPluginUnicorn.configs.recommended.rules,
      },
    },
  ];
}
