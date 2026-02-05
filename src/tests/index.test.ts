import type { Linter } from 'eslint';
import { describe, expect, it, vi } from 'vitest';

import config from '../index.js';
import * as utils from '../utils.js';

vi.mock('../utils.js', () => ({
  isPackageExists: vi.fn(),
  hasTsconfig: vi.fn()
}));

describe('config factory', () => {
  it('should merge global ignores correctly', () => {
    const customIgnore = '**/my-custom-ignore';

    vi.mocked(utils.isPackageExists).mockReturnValue(false);
    vi.mocked(utils.hasTsconfig).mockReturnValue(false);

    const configs = config({ ignores: [customIgnore] });
    const ignoreConfig = configs.find(
      (c) => c.name === 'config/global-ignores'
    );

    expect(ignoreConfig?.ignores).toContain(customIgnore);
    expect(ignoreConfig?.ignores).toContain('**/node_modules');
  });

  it('should allow global rule overrides', () => {
    const overrides = { 'no-console': 'error' as const };

    vi.mocked(utils.isPackageExists).mockReturnValue(false);
    vi.mocked(utils.hasTsconfig).mockReturnValue(false);

    const configs = config({ overrides });
    const overrideBlock = configs.find(
      (c) => c.name === 'config/global-overrides'
    );

    expect(overrideBlock?.rules?.['no-console']).toBe('error');
  });

  it('should append user configs at the end', () => {
    const userConfig = {
      name: 'user-config',
      rules: { 'custom-rule': 'error' }
    };

    vi.mocked(utils.isPackageExists).mockReturnValue(false);
    vi.mocked(utils.hasTsconfig).mockReturnValue(false);

    const configs = config({}, userConfig as unknown as Linter.Config);

    expect(configs.at(-1)).toEqual(userConfig);
  });

  it('should include typescript configs when typescript exists', () => {
    vi.mocked(utils.isPackageExists).mockReturnValue(true);
    vi.mocked(utils.hasTsconfig).mockReturnValue(false);

    const configs = config();
    const hasTsConfig = configs.some((c) => c.name?.includes('typescript'));

    expect(hasTsConfig).toBeTruthy();
  });

  it('should use type-checked configs when tsconfig exists', () => {
    vi.mocked(utils.isPackageExists).mockReturnValue(true);
    vi.mocked(utils.hasTsconfig).mockReturnValue(true);

    const configs = config();
    const hasTypeChecked = configs.some((c) =>
      c.name?.includes('typescript/type-checked')
    );

    expect(hasTypeChecked).toBeTruthy();
  });

  it('should use strict type-checked configs when strict is enabled', () => {
    vi.mocked(utils.isPackageExists).mockReturnValue(true);
    vi.mocked(utils.hasTsconfig).mockReturnValue(true);

    const configs = config({ strict: true });
    const hasStrict = configs.some((c) =>
      c.name?.includes('typescript/type-checked')
    );

    expect(hasStrict).toBeTruthy();
  });

  it('should tighten javascript rules when strict is enabled', () => {
    vi.mocked(utils.isPackageExists).mockReturnValue(false);
    vi.mocked(utils.hasTsconfig).mockReturnValue(false);

    const configs = config({ strict: true });
    const jsRules = configs.find(
      (c) => c.name === 'config/javascript/rules'
    )?.rules;

    expect(jsRules?.['no-console']).toBe('warn');
    expect(jsRules?.['no-unused-vars']).toBe('error');
    expect(jsRules?.['no-empty']).toBe('error');
  });

  it('should include react configs when react exists', () => {
    vi.mocked(utils.isPackageExists).mockImplementation(
      (pkg) => pkg === 'react'
    );
    vi.mocked(utils.hasTsconfig).mockReturnValue(false);

    const configs = config();
    const hasReact = configs.some((c) => c.name?.includes('react'));

    expect(hasReact).toBeTruthy();
  });

  it('should include a11y rules only when react-dom exists', () => {
    vi.mocked(utils.isPackageExists).mockImplementation(
      (pkg) => pkg === 'react' || pkg === 'react-dom'
    );
    vi.mocked(utils.hasTsconfig).mockReturnValue(false);

    const configs = config();
    const hasA11y = configs.some((c) => c.plugins && 'jsx-a11y' in c.plugins);

    expect(hasA11y).toBeTruthy();
  });

  it('should include react-refresh only when refresh tooling exists', () => {
    vi.mocked(utils.isPackageExists).mockImplementation(
      (pkg) => pkg === 'react' || pkg === '@vitejs/plugin-react'
    );
    vi.mocked(utils.hasTsconfig).mockReturnValue(false);

    const configs = config();
    const hasRefresh = configs.some(
      (c) => c.plugins && 'react-refresh' in c.plugins
    );

    expect(hasRefresh).toBeTruthy();
  });

  it('should include unicorn configs when enabled', () => {
    vi.mocked(utils.isPackageExists).mockReturnValue(false);
    vi.mocked(utils.hasTsconfig).mockReturnValue(false);

    const configs = config({ unicorn: true });
    const hasUnicorn = configs.some((c) => c.name?.includes('unicorn'));

    expect(hasUnicorn).toBeTruthy();
  });

  it('should include perfectionist configs when enabled', () => {
    vi.mocked(utils.isPackageExists).mockReturnValue(false);
    vi.mocked(utils.hasTsconfig).mockReturnValue(false);

    const configs = config({ perfectionist: true });
    const hasPerfectionist = configs.some((c) =>
      c.name?.includes('perfectionist')
    );

    expect(hasPerfectionist).toBeTruthy();
  });
});
