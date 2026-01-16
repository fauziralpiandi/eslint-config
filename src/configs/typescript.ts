import type { Linter } from 'eslint';
import tseslint from 'typescript-eslint';

import { GLOB } from '../glob.js';

export function typescript(): Linter.Config[] {
  const configs = [
    ...tseslint.configs.recommendedTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
  ];

  return [
    {
      name: 'config/typescript/setup',
      files: [GLOB.TS, GLOB.TSX],
      languageOptions: {
        parserOptions: {
          projectService: true,
          tsconfigRootDir: process.cwd(),
        },
      },
    },
    ...configs.map((config) => ({
      ...config,
      files: [GLOB.TS, GLOB.TSX],
      name: `config/typescript/${config.name ?? 'unnamed'}`,
    })),
  ] as Linter.Config[];
}
