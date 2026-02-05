import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { hasTsconfig } from '../utils.js';

describe('hasTsconfig', () => {
  const originalCwd = process.cwd();

  let tempDir = '';

  beforeEach(() => {
    tempDir = mkdtempSync(path.join(tmpdir(), 'eslint-config-'));
    process.chdir(tempDir);
  });

  afterEach(() => {
    process.chdir(originalCwd);
    rmSync(tempDir, { recursive: true, force: true });
  });

  it('returns false when no tsconfig files exist', () => {
    expect(hasTsconfig()).toBe(false);
  });

  it('recognizes tsconfig.jsonc', () => {
    writeFileSync(path.join(tempDir, 'tsconfig.jsonc'), '{}');

    expect(hasTsconfig()).toBe(true);
  });

  it('recognizes tsconfig.json5', () => {
    writeFileSync(path.join(tempDir, 'tsconfig.json5'), '{}');

    expect(hasTsconfig()).toBe(true);
  });
});
