/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import type { Linter } from 'eslint';
import pluginTailwind from 'eslint-plugin-tailwindcss';

import { GLOB } from './glob.js';

export function tailwind(): Linter.Config[] {
  return [
    {
      name: 'config/tailwind/rules',
      files: GLOB.SRC,
      plugins: {
        tailwindcss: pluginTailwind
      },
      rules: {
        ...pluginTailwind.configs.recommended.rules,
        'tailwindcss/no-custom-classname': 'off'
      }
    }
  ];
}
