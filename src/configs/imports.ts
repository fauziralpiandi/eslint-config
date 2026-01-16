import type { Linter } from 'eslint';
import pluginSimpleImportSort from 'eslint-plugin-simple-import-sort';

export function imports(): Linter.Config[] {
  return [
    {
      name: 'config/imports/rules',
      plugins: {
        'simple-import-sort': pluginSimpleImportSort,
      },
      rules: {
        'simple-import-sort/imports': 'error',
        'simple-import-sort/exports': 'error',
      },
    },
  ];
}
