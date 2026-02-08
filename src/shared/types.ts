import type { Config } from "eslint/config";
import type { EnvOption } from "./utils";

export type { Config };
export type ConfigArray = Config[];
export interface ConfigOptions {
  env?: EnvOption;
  ignores?: string[];
  strict?: boolean;
  stylistic?: boolean;
  project?: string[] | false;
  overrides?: Config[];
}
