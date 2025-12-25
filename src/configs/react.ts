import type { Linter } from 'eslint';
import pluginJsxA11y from 'eslint-plugin-jsx-a11y';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';

export function react(): Linter.Config[] {
  return [
    {
      name: 'fauziralpiandi/react/setup',
      settings: {
        react: {
          version: 'detect',
        },
      },
      plugins: {
        'react': pluginReact as any,
        'react-hooks': pluginReactHooks as any,
        'jsx-a11y': pluginJsxA11y,
      },
    },
    {
      name: 'fauziralpiandi/react/rules',
      files: ['**/*.jsx', '**/*.tsx'],
      rules: {
        ...pluginReact.configs.recommended.rules,
        ...pluginReact.configs['jsx-runtime'].rules,
        ...(pluginReactHooks.configs.recommended.rules as any),
        ...pluginJsxA11y.configs.recommended.rules,
        'react/prop-types': 'off', // we use typescript
        'react/react-in-jsx-scope': 'off', // not needed in react 17+
      },
    },
  ];
}
