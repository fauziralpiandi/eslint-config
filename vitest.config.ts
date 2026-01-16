import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: '@fauziralpiandi/eslint-config',
    include: ['src/**/*.test.ts'],
  },
});
