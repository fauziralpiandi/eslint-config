/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import type { Linter } from 'eslint';
import { createRequire } from 'node:module';

import { GLOB } from './glob.js';

const require = createRequire(import.meta.url);

export function tailwind(): Linter.Config[] {
  // lazy load, so it doesn't nuke the process on tailwind v4.
  const pluginTailwind = require('eslint-plugin-tailwindcss');

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
