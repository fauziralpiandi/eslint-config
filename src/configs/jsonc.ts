import type { Linter } from 'eslint';
import pluginJsonc from 'eslint-plugin-jsonc';
import parserJsonc from 'jsonc-eslint-parser';

export function jsonc(): Linter.Config[] {
  return [
    {
      name: 'fauziralpiandi/jsonc/setup',
      plugins: {
        jsonc: pluginJsonc as any,
      },
    },
    {
      name: 'fauziralpiandi/jsonc/rules',
      files: ['**/*.json', '**/*.jsonc', '**/*.json5'],
      languageOptions: {
        parser: parserJsonc as any,
      },
      rules: {
        ...(pluginJsonc as any).configs?.recommended?.rules,
        'jsonc/quotes': 'off',
        'jsonc/quote-props': 'off',
      },
    },
    {
      files: ['**/package.json'],
      rules: {
        'jsonc/sort-keys': [
          'error',
          {
            pathPattern: '^$',
            order: [
              'name',
              'version',
              'private',
              'description',
              'keywords',
              'license',
              'author',
              'repository',
              'funding',
              'bugs',
              'homepage',
              'type',
              'packageManager',
              'main',
              'module',
              'types',
              'exports',
              'bin',
              'files',
              'workspaces',
              'scripts',
              'dependencies',
              'devDependencies',
              'peerDependencies',
              'peerDependenciesMeta',
              'optionalDependencies',
              'resolutions',
              'overrides',
              'engines',
              'os',
              'cpu',
              'publishConfig',
              'eslintConfig',
              'prettier',
            ],
          },
          {
            pathPattern: '^(?:dev|peer|optional|bundled)?[Dd]ependencies$',
            order: { type: 'asc' },
          },
          {
            pathPattern: '^exports.*$',
            order: ['types', 'import', 'require', 'default'],
          },
        ],
      },
    },
  ];
}
