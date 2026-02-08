export const GLOB = {
  JS: ["**/*.?([cm])js?(x)"],
  TS: ["**/*.?([cm])ts?(x)"],
  EXCLUDE: [
    "**/node_modules/**",
    "**/dist/**",
    "**/build/**",
    "**/out/**",
    "**/coverage/**",
    "**/.cache/**",
    "**/.eslintcache",

    "**/.turbo/**",
    "**/.vercel/**",
    "**/.next/**",
    "**/.nuxt/**",
    "**/.astro/**",
    "**/.svelte-kit/**",
    "**/.parcel-cache/**",

    "**/.config/**",
    "**/.local/**",
    "**/.upm",

    "**/package-lock.json",
    "**/pnpm-lock.yaml",
    "**/yarn.lock",
    "**/bun.lockb",

    "**/*.min.*"
  ]
} as const;

export const DEFAULT_IGNORES = GLOB.EXCLUDE;
