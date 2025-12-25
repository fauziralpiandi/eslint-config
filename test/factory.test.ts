import type { Linter } from 'eslint';
import { describe, expect, it } from 'vitest';

import { fauziralpiandi } from '../src/factory.js';

describe('fauziralpiandi factory', () => {
  it('should return a default configuration array', () => {
    const configs = fauziralpiandi();

    expect(Array.isArray(configs)).toBe(true);
    expect(configs.length).toBeGreaterThan(0);
  });

  it('should include typescript rules when enabled', () => {
    const configs = fauziralpiandi({ typescript: true });
    const hasTS = configs.some(
      (c: Linter.Config) =>
        c.name?.includes('typescript')
        ?? c.files?.some(f => typeof f === 'string' && f.includes('.ts')),
    );

    expect(hasTS).toBe(true);
  });

  it('should not include react rules by default', () => {
    const configs = fauziralpiandi({ react: false });
    const hasReact = configs.some((c: Linter.Config) =>
      c.name?.includes('react'),
    );

    expect(hasReact).toBe(false);
  });

  it('should respect custom ignores', () => {
    const configs = fauziralpiandi({ ignores: ['tmp/**'] });
    const ignoreConfig = configs.find((c: Linter.Config) => c.ignores);

    expect(ignoreConfig?.ignores).toContain('tmp/**');
  });
});
