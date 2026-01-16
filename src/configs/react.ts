import type { ESLint, Linter } from 'eslint';
import pluginJsxA11y from 'eslint-plugin-jsx-a11y';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';

import { GLOB } from '../glob.js';

interface LegacyPlugin {
  configs: {
    recommended: { rules: Linter.RulesRecord };
    'jsx-runtime': { rules: Linter.RulesRecord };
  };
}

export function react(): Linter.Config[] {
  const react = pluginReact as unknown as LegacyPlugin;
  const reactHooks = pluginReactHooks as unknown as LegacyPlugin;
  const jsxA11y = pluginJsxA11y as unknown as LegacyPlugin;

  return [
    {
      name: 'config/react/setup',
      settings: {
        react: {
          version: 'detect',
        },
      },
      plugins: {
        react: pluginReact as unknown as ESLint.Plugin,
        'react-hooks': pluginReactHooks as unknown as ESLint.Plugin,
        'jsx-a11y': pluginJsxA11y as unknown as ESLint.Plugin,
      },
    },
    {
      name: 'config/react/rules',
      files: [GLOB.JSX, GLOB.TSX],
      rules: {
        ...react.configs.recommended.rules,
        ...react.configs['jsx-runtime'].rules,
        ...reactHooks.configs.recommended.rules,
        ...jsxA11y.configs.recommended.rules,
        'react/prop-types': 'off', // we use typescript
        'react/react-in-jsx-scope': 'off', // not needed in react 17+
      },
    },
  ];
}
