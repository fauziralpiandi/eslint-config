export const GLOB = {
  EXCLUDE: [
    '**/node_modules',
    '**/dist',
    '**/output',
    '**/coverage',
    '**/temp',
    '**/.temp',
    '**/.next',
    '**/.cache',
    '**/.config',
    '**/.astro',
    '**/.vercel',
    '**/.upm',
    '**/pnpm-lock.yaml',
    '**/package-lock.json',
    '**/*.min.*'
  ],
  SRC: ['**/*.?([cm])[jt]s?(x)', '**/*.?([cm])[jt]sx'],
  MISC: [
    `**/*.spec.?([cm])[jt]s?(x)`,
    `**/*.test.?([cm])[jt]s?(x)`,
    `**/*.bench.?([cm])[jt]s?(x)`
  ]
};
