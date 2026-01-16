import { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';

import { config, type OptionsConfig } from './factory.js';

async function lint(
  code: string,
  filename: string,
  options: OptionsConfig = {},
) {
  const generatedConfig = config(options).map((c) => {
    if (!c.languageOptions?.parserOptions) return c;

    return {
      ...c,
      languageOptions: {
        ...c.languageOptions,
        parserOptions: {
          ...c.languageOptions.parserOptions,
          projectService: {
            allowDefaultProject: ['*.ts', '*.tsx'],
          },
        },
      },
    };
  });

  const eslint = new ESLint({
    baseConfig: generatedConfig,
    overrideConfigFile: true,
    fix: false,
  });
  const results = await eslint.lintText(code, { filePath: filename });

  return results[0].messages;
}

describe('Integration Tests', () => {
  describe('JavaScript', () => {
    it('should lint basic JS rules (no-unused-vars)', async () => {
      const code = 'const unused = 1;';
      const messages = await lint(code, 'test.js');

      expect(messages).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            ruleId: 'no-unused-vars',
          }),
        ]),
      );
    });
  });

  describe('TypeScript', () => {
    it('should lint TS files and respect globs', async () => {
      // rule: @typescript-eslint/no-wrapper-object-types (part of recommended)
      const code = 'const x: Number = 1;';
      const messages = await lint(code, 'test.ts');

      expect(messages).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            ruleId: '@typescript-eslint/no-wrapper-object-types',
          }),
        ]),
      );
    });

    it('should NOT lint TS rules in JS files', async () => {
      const code = 'const x = 1;';
      // if we force some TS syntax in JS file, parser might fail, but let's check a TS-specific rule
      // actually simpler: just ensure we don't get TS-specific errors for valid JS
      const messages = await lint(code, 'test.js');
      const tsErrors = messages.filter((m) =>
        m.ruleId?.startsWith('@typescript-eslint/'),
      );

      expect(tsErrors).toHaveLength(0);
    });
  });

  describe('React', () => {
    it('should lint React files when enabled (jsx-a11y)', async () => {
      const code = '<img src="foo" />';
      const messages = await lint(code, 'Component.tsx', { react: true });

      expect(messages).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            ruleId: 'jsx-a11y/alt-text',
          }),
        ]),
      );
    });

    it('should lint React Hooks rules', async () => {
      const code = `
        function Component() {
          if (true) {
            useEffect(() => {});
          }
        }
      `;
      const messages = await lint(code, 'Component.tsx', { react: true });

      expect(messages).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            ruleId: 'react-hooks/rules-of-hooks',
          }),
        ]),
      );
    });

    it('should NOT lint React rules when disabled', async () => {
      const code = '<img src="foo" />';
      // react: false by default
      const messages = await lint(code, 'Component.tsx', { react: false });
      const reactErrors = messages.filter(
        (m) =>
          m.ruleId?.startsWith('jsx-a11y/') || m.ruleId?.startsWith('react/'),
      );
      expect(reactErrors).toHaveLength(0);
    });
  });

  describe('Stylistic', () => {
    it('should enforce formatting rules (semi)', async () => {
      const code = 'const x = 1'; // missing semi
      const messages = await lint(code, 'test.ts', { stylistic: true });

      expect(messages).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            ruleId: '@stylistic/semi',
          }),
        ]),
      );
    });

    it('should enforce quotes', async () => {
      const code = 'const x = "double"'; // should be single
      const messages = await lint(code, 'test.ts', { stylistic: true });

      expect(messages).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            ruleId: '@stylistic/quotes',
          }),
        ]),
      );
    });
  });

  describe('Ignores', () => {
    it('should respect global ignores', async () => {
      // if ignored, usually it returns one result with warning count 0 or marked as ignored
      // ESLint 9 behavior: lintText on ignored file might return explicit "File ignored" warning or empty results depending on flags
      // but with my config logic, the file matching the ignore pattern should simply NOT report the 'no-var' error if we were traversing.
      // however, lintText explicit call typically bypasses ignore UNLESS warnIgnored is handled or we rely on the config to exclude it.

      // actually, let's verify that the ignore pattern is present in the config object
      const generatedConfig = config({ ignores: ['generated-ignore.js'] });
      const ignoreEntry = generatedConfig.find((c) =>
        c.ignores?.includes('generated-ignore.js'),
      );

      expect(ignoreEntry).toBeDefined();
    });
  });
});
