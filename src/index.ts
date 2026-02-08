import { defineConfig } from "eslint/config";
import { javascriptConfig } from "./config/javascript.js";
import { typescriptConfig } from "./config/typescript.js";
import { DEFAULT_IGNORES } from "./shared/glob.js";
import type { Config, ConfigArray, ConfigOptions } from "./shared/types.js";

function config(
  options: ConfigOptions = {},
  ...userConfigs: (Config | Config[])[]
): ConfigArray {
  const {
    env,
    ignores = [...DEFAULT_IGNORES],
    strict = false,
    overrides = []
  } = options;

  const mergedConfigs: Config[] = [
    {
      name: "@fauziralpiandi/eslint-config/global-ignores",
      ignores
    },
    ...javascriptConfig({ env }),
    ...typescriptConfig({ env, strict }),
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
export type { Config, ConfigOptions } from "./shared/types.js";
