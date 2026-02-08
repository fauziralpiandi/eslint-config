import js from "@eslint/js";

import { GLOB } from "../shared/glob";
import type { Config } from "../shared/types";
import { resolveGlobals, type EnvOption } from "../shared/utils";

interface JsOptions {
  env?: EnvOption;
  strict?: boolean;
}

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
