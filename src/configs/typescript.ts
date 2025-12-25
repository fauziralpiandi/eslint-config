import type { Linter } from 'eslint';
import tseslint from 'typescript-eslint';

export function typescript(): Linter.Config[] {
  const configs = [
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
  ];

  return [
    {
      name: 'fauziralpiandi/typescript/setup',
      files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
      languageOptions: {
        parserOptions: {
          projectService: true,
          tsconfigRootDir: process.cwd(),
        },
      },
    },
    ...configs.map(config => ({
      ...config,
      files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
      name: `fauziralpiandi/typescript/${config.name ?? 'unnamed'}`,
    })),
    {
      name: 'fauziralpiandi/typescript/rules',
      files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
      rules: {
        '@typescript-eslint/no-unused-vars': [
          'warn',
          { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
        ],
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/consistent-type-imports': [
          'error',
          { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
        ],
        '@typescript-eslint/no-misused-promises': [
          'error',
          { checksVoidReturn: { attributes: false } },
        ],
        '@typescript-eslint/no-floating-promises': 'error',
        '@typescript-eslint/restrict-template-expressions': 'off',
      },
    },
  ] as Linter.Config[];
}
