import js from "@eslint/js";

import { GLOB } from "../shared/glob.js";
import type { Config } from "../shared/types.js";
import { resolveGlobals, type EnvOption } from "../shared/utils.js";

type JsOptions = {
  env?: EnvOption;
};

export function javascriptConfig(options: JsOptions = {}): Config[] {
  const { env } = options;

  return [
    {
      ...js.configs.recommended,
      files: [...GLOB.JS],
      name: "@fauziralpiandi/eslint-config/javascript/recommended"
    },
    {
      name: "@fauziralpiandi/eslint-config/javascript/setup",
      files: [...GLOB.JS],
      languageOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        globals: resolveGlobals(env),
        parserOptions: {
          ecmaFeatures: {
            jsx: true
          }
        }
      }
    }
  ];
}
