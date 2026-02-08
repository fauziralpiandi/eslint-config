import { GLOB } from "../shared/glob.js";
import type { Config } from "../shared/types.js";
import {
  isPackageAvailable,
  loadTypescriptEslint,
  resolveGlobals,
  resolveTsconfigProjects,
  type EnvOption
} from "../shared/utils.js";

type TsOptions = {
  env?: EnvOption;
  strict?: boolean;
};

export function typescriptConfig(options: TsOptions = {}): Config[] {
  const { env, strict = false } = options;

  if (!isPackageAvailable("typescript")) return [];

  const tseslint = loadTypescriptEslint();

  if (!tseslint) return [];

  const projectPaths = resolveTsconfigProjects();
  const typeChecked = projectPaths.length > 0;

  const baseConfigs = typeChecked
    ? strict
      ? tseslint.configs.strictTypeChecked
      : tseslint.configs.recommendedTypeChecked
    : strict
      ? tseslint.configs.strict
      : tseslint.configs.recommended;

  const parserOptions = typeChecked
    ? {
        project: projectPaths,
        tsconfigRootDir: process.cwd()
      }
    : undefined;

  const normalizedConfigs = baseConfigs.map((config, i) => ({
    ...config,
    files: [...GLOB.TS],
    name: `@fauziralpiandi/eslint-config/typescript/${typeChecked ? "type-checked" : "base"}-${String(i)}`
  }));

  return [
    {
      name: "@fauziralpiandi/eslint-config/typescript/setup",
      files: [...GLOB.TS],
      languageOptions: {
        parser: tseslint.parser,
        globals: resolveGlobals(env),
        parserOptions
      }
    },
    ...normalizedConfigs
  ];
}
