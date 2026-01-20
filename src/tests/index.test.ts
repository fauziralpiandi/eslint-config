import type { Linter } from 'eslint';
import { describe, expect, it, vi } from 'vitest';
import config from '../index.js';
import * as utils from '../utils.js';

vi.mock('../utils.js', () => ({
  isPackageExists: vi.fn()
}));

describe('config factory', () => {
  it('should merge global ignores correctly', () => {
    const customIgnore = '**/my-custom-ignore';
    const configs = config({ ignores: [customIgnore] });
    const ignoreConfig = configs.find(
      c => c.name === 'config/global-ignores'
    );

    expect(ignoreConfig?.ignores).toContain(customIgnore);
    expect(ignoreConfig?.ignores).toContain('**/node_modules');
  });

  describe('should include correct configs based on package detection', () => {
    it('typescript', () => {
      vi.mocked(utils.isPackageExists).mockImplementation(
        pkg => pkg === 'typescript'
      );

      const configs = config();
      const hasTsParser = configs.some(c =>
        c.languageOptions?.parser?.toString().includes('typescript-eslint')
      );
      const hasTsName = configs.some(c => c.name?.includes('typescript'));

      expect(hasTsParser || hasTsName).toBeTruthy();
    });

    it('vitest', () => {
      vi.mocked(utils.isPackageExists).mockImplementation(
        pkg => pkg === 'vitest'
      );

      const configs = config();
      const hasVitestPlugin = configs.some(
        c => c.plugins && 'vitest' in c.plugins
      );

      expect(hasVitestPlugin).toBeTruthy();
    });

    it('react', () => {
      vi.mocked(utils.isPackageExists).mockImplementation(
        pkg => pkg === 'react'
      );

      const configs = config();
      const hasReactPlugin = configs.some(
        c => c.plugins && 'react' in c.plugins
      );

      expect(hasReactPlugin).toBeTruthy();
    });

    it('tailwindcss', () => {
      vi.mocked(utils.isPackageExists).mockImplementation(
        pkg => pkg === 'tailwindcss'
      );

      const configs = config();
      const hasTailwindPlugin = configs.some(
        c => c.plugins && 'tailwindcss' in c.plugins
      );

      expect(hasTailwindPlugin).toBeTruthy();
    });
  });

  it('should ensure core plugins are ALWAYS present', () => {
    vi.mocked(utils.isPackageExists).mockReturnValue(false);

    const configs = config();
    const hasPerfectionist = configs.some(c => c.name?.includes('perfectionist'));
    const hasStylistic = configs.some(c => c.name?.includes('stylistic'));
    const hasUnicorn = configs.some(c => c.name?.includes('unicorn'));

    expect(hasPerfectionist).toBeTruthy();
    expect(hasStylistic).toBeTruthy();
    expect(hasUnicorn).toBeTruthy();
  });

  it('should allow global rule overrides', () => {
    const overrides = { 'no-console': 'error' as const };
    const configs = config({ overrides });
    const overrideBlock = configs.find(
      c => c.name === 'config/global-overrides'
    );

    expect(overrideBlock?.rules?.['no-console']).toBe('error');
  });

  it('should append user configs at the end', () => {
    const userConfig = {
      name: 'user-config',
      rules: { 'custom-rule': 'error' }
    };
    const configs = config({}, userConfig as unknown as Linter.Config);

    expect(configs.at(-1)).toEqual(userConfig);
  });
});
