import type { Config } from "eslint/config";
import type { EnvOption } from "./utils.js";

export type { Config };
export type ConfigArray = Config[];
export type ConfigOptions = {
  env?: EnvOption;
  ignores?: string[];
  strict?: boolean;
  overrides?: Config[];
};
