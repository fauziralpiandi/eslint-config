import { readdirSync } from "node:fs";
import { createRequire } from "node:module";
import globals from "globals";

export type EnvName = "node" | "browser" | "worker";
export type EnvOption = EnvName | EnvName[];

const ENV_MAP: Record<EnvName, Record<string, boolean>> = {
  node: globals.node,
  browser: globals.browser,
  worker: globals.worker
};

const DEFAULT_ENV: EnvName[] = ["node", "browser"];

export function resolveGlobals(env?: EnvOption): Record<string, boolean> {
  const resolved = normalizeEnv(env);
  const merged: Record<string, boolean> = { ...globals.es2022 };

  for (const name of resolved) {
    Object.assign(merged, ENV_MAP[name]);
  }

  return merged;
}

function normalizeEnv(env?: EnvOption): EnvName[] {
  if (!env) return DEFAULT_ENV;
  if (Array.isArray(env)) return env;

  return [env];
}

export function resolveTsconfigProjects(): string[] {
  try {
    const entries = readdirSync(process.cwd(), {
      withFileTypes: true,
      encoding: "utf8"
    });

    return entries
      .filter(
        (entry) =>
          entry.isFile() && /^tsconfig(\..+)?\.json(?:c|5)?$/.test(entry.name)
      )
      .map((entry) => `./${entry.name}`);
  } catch {
    return [];
  }
}

const require = createRequire(import.meta.url);

export function isPackageAvailable(name: string): boolean {
  try {
    require.resolve(name);
    return true;
  } catch {
    return false;
  }
}

export function loadTypescriptEslint():
  | typeof import("typescript-eslint")
  | null {
  try {
    return require("typescript-eslint") as typeof import("typescript-eslint");
  } catch {
    return null;
  }
}
