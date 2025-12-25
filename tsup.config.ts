import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  minify: false, // Biar kebaca kalau mau debug
  external: [
    'eslint',
    'typescript',
    'globals',
    'typescript-eslint',
    '@stylistic/eslint-plugin',
    'eslint-plugin-simple-import-sort',
    'eslint-plugin-unicorn',
    'eslint-plugin-react',
    'eslint-plugin-react-hooks',
    'eslint-plugin-jsx-a11y',
    'eslint-plugin-jsonc',
    'jsonc-eslint-parser',
    '@eslint/js',
  ],
});
