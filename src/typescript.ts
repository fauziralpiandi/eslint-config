import type { Linter } from 'eslint';
import tseslint from 'typescript-eslint';

import { GLOB } from './glob.js';

export function typescript(): Linter.Config[] {
  return [
    {
      name: 'config/typescript/setup',
      files: GLOB.SRC,
      languageOptions: {
        parser: tseslint.parser,
        parserOptions: {
          projectService: true,
          tsconfigRootDir: process.cwd()
        }
      }
    },
    ...tseslint.configs.strictTypeChecked.map(config => ({
      ...config,
      files: GLOB.SRC
    })),
    ...tseslint.configs.stylisticTypeChecked.map(config => ({
      ...config,
      files: GLOB.SRC
    })),
    {
      name: 'config/typescript/rules',
      files: GLOB.SRC,
      rules: {
        // better transpilation performance
        '@typescript-eslint/consistent-type-imports': 'warn',
        // useful for React placeholder props
        '@typescript-eslint/no-empty-interface': 'off',
        // don't block development bcs of this
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-unsafe-argument': 'warn',
        // relax "unsafe" rules to avoid stress
        '@typescript-eslint/no-unsafe-assignment': 'warn',
        '@typescript-eslint/no-unsafe-call': 'warn',
        '@typescript-eslint/no-unsafe-member-access': 'warn',
        '@typescript-eslint/no-unsafe-return': 'warn',
        // be chill during development (DX)
        '@typescript-eslint/no-unused-vars': 'warn'
      }
    },
    {
      name: 'config/typescript/test-overrides',
      files: GLOB.MISC,
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unused-expressions': 'off',
        'no-unused-expressions': 'off'
      }
    }
  ] as Linter.Config[];
}
