import type { Linter } from 'eslint';
import tseslint from 'typescript-eslint';

import { GLOB } from './glob.js';

interface TypescriptOptions {
  strict: boolean;
  typeChecked: boolean;
}

export function typescript(options: TypescriptOptions): Linter.Config[] {
  const configs = options.typeChecked
    ? options.strict
      ? tseslint.configs.strictTypeChecked
      : tseslint.configs.recommendedTypeChecked
    : tseslint.configs.recommended;

  return [
    {
      name: 'config/typescript/setup',
      files: GLOB.TS,
      languageOptions: {
        parser: tseslint.parser,
        parserOptions: options.typeChecked
          ? {
              projectService: true,
              tsconfigRootDir: process.cwd()
            }
          : {}
      }
    },
    ...configs.map((config, index) => ({
      ...config,
      files: GLOB.TS,
      name: `config/typescript/${options.typeChecked ? 'type-checked' : 'base'}-${String(index)}`
    })),
    {
      name: 'config/typescript/rules',
      files: GLOB.TS,
      rules: {
        ...(options.typeChecked
          ? {
              '@typescript-eslint/prefer-nullish-coalescing': 'warn',
              '@typescript-eslint/prefer-optional-chain': 'warn'
            }
          : {}),
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-unused-vars': 'warn',
        ...(options.typeChecked
          ? {
              '@typescript-eslint/no-misused-promises': 'warn',
              '@typescript-eslint/no-unsafe-argument': 'warn',
              '@typescript-eslint/no-unsafe-assignment': 'warn'
            }
          : {})
      }
    }
  ] as Linter.Config[];
}
