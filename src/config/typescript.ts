import { GLOB } from "../shared/glob";
import type { Config } from "../shared/types";
import {
  isPackageAvailable,
  loadTypescriptEslint,
  resolveGlobals,
  resolveTsconfigProjects,
  type EnvOption
} from "../shared/utils";

interface TsOptions {
  env?: EnvOption;
  strict?: boolean;
  stylistic?: boolean;
  project?: string[] | false;
}

export function typescriptConfig(options: TsOptions = {}): Config[] {
  const { env, strict = false, stylistic = false, project } = options;

  if (!isPackageAvailable("typescript")) return [];

  const tseslint = loadTypescriptEslint();

  if (!tseslint) return [];

  const projectPaths =
    project === false
      ? []
      : Array.isArray(project)
        ? project
        : resolveTsconfigProjects();
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

  const stylisticConfigs = stylistic
    ? typeChecked
      ? tseslint.configs.stylisticTypeChecked
      : tseslint.configs.stylistic
    : [];

  const normalizedStylisticConfigs = stylisticConfigs.map((config, i) => ({
    ...config,
    files: [...GLOB.TS],
    name: `@fauziralpiandi/eslint-config/typescript/stylistic-${typeChecked ? "type-checked" : "base"}-${String(i)}`
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
    ...normalizedConfigs,
    ...normalizedStylisticConfigs
  ];
}
