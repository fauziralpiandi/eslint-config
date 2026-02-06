import type { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';

const pluginMock = {
  configs: {
    recommended: {
      rules: {
        '@next/next/no-html-link-for-pages': 'warn'
      },
      settings: {
        next: {
          rootDir: ['app']
        }
      },
      languageOptions: {
        parserOptions: {
          ecmaVersion: 2021
        }
      }
    },
    'core-web-vitals': {
      rules: {
        '@next/next/no-img-element': 'error'
      }
    }
  }
};

import { nextjs } from '../next.js';

describe('nextjs', () => {
  it('merges rules with settings and language options', () => {
    const configs = nextjs(pluginMock as ESLint.Plugin);
    const rulesConfig = configs.find((config) =>
      config.name?.includes('nextjs/rules')
    );

    expect(rulesConfig?.rules?.['@next/next/no-img-element']).toBe('error');
    expect(rulesConfig?.rules?.['@next/next/no-html-link-for-pages']).toBe(
      'warn'
    );
    expect(rulesConfig?.settings).toEqual({
      next: {
        rootDir: ['app']
      }
    });
    expect(rulesConfig?.languageOptions).toEqual({
      parserOptions: {
        ecmaVersion: 2021
      }
    });
  });
});
