import { defineConfig } from "eslint/config";
import { javascriptConfig } from "./config/javascript";
import { typescriptConfig } from "./config/typescript";
import { DEFAULT_IGNORES } from "./shared/glob";
import type { Config, ConfigArray, ConfigOptions } from "./shared/types";

function config(
  options: ConfigOptions = {},
  ...userConfigs: (Config | Config[])[]
): ConfigArray {
  const {
    env,
    ignores = [],
    strict = false,
    stylistic = false,
    project,
    overrides = []
  } = options;
  const mergedIgnores = [...DEFAULT_IGNORES, ...ignores];

  const mergedConfigs: Config[] = [
    {
      name: "@fauziralpiandi/eslint-config/global-ignores",
      ignores: mergedIgnores
    },
    ...javascriptConfig({ env, strict }),
    ...typescriptConfig({ env, strict, stylistic, project }),
    ...overrides
  ];

  for (const userConfig of userConfigs) {
    if (Array.isArray(userConfig)) mergedConfigs.push(...userConfig);
    else mergedConfigs.push(userConfig);
  }

  return defineConfig(mergedConfigs);
}

export { config };
export default config;
export type { Config, ConfigOptions } from "./shared/types";
