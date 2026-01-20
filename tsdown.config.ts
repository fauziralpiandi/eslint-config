import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  target: 'node18.18',
  dts: true,
  external: [
    '@eslint/compat',
    '@eslint/js',
    '@stylistic/eslint-plugin',
    'eslint-plugin-jsx-a11y',
    'eslint-plugin-perfectionist',
    'eslint-plugin-react',
    'eslint-plugin-react-hooks',
    'eslint-plugin-react-refresh',
    'eslint-plugin-tailwindcss',
    'eslint-plugin-unicorn',
    'globals',
    'typescript-eslint',
  ],
});
