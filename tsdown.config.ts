import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  dts: true,
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
    '@eslint/js',
  ],
});
