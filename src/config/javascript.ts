import js from "@eslint/js";

import { GLOB } from "../shared/glob.js";
import type { Config } from "../shared/types.js";
import {
  resolveGlobals,
  type EnvName,
  type EnvOption
} from "../shared/utils.js";

type JsOptions = {
  env?: EnvOption;
  strict?: boolean;
};

const DEFAULT_ENV: EnvName[] = ["node", "browser"];

const STRICT_RULES_BASE: Config["rules"] = {
  "no-eval": "error",
  "no-implied-eval": "error",
  "no-new-func": "error",
  "no-console": "error",
  "no-warning-comments": "warn"
};

const STRICT_RULES_BROWSER: Config["rules"] = {
  "no-alert": "error",
  "no-script-url": "error",
  "no-restricted-properties": [
    "error",
    {
      object: "document",
      property: "write",
      message: "Avoid document.write; it can lead to XSS."
    },
    {
      object: "document",
      property: "writeln",
      message: "Avoid document.writeln; it can lead to XSS."
    },
    {
      property: "innerHTML",
      message: "Avoid innerHTML; prefer safe DOM APIs."
    },
    {
      property: "outerHTML",
      message: "Avoid outerHTML; prefer safe DOM APIs."
    },
    {
      property: "insertAdjacentHTML",
      message: "Avoid insertAdjacentHTML; prefer safe DOM APIs."
    }
  ]
};

const STRICT_RULES_NODE: Config["rules"] = {
  "no-process-exit": "error"
};

export function javascriptConfig(options: JsOptions = {}): Config[] {
  const { env, strict = false } = options;
  const resolvedEnv = normalizeEnv(env);
  const hasBrowser = resolvedEnv.includes("browser");
  const hasNode = resolvedEnv.includes("node");

  const strictRules: Config["rules"] = {
    ...STRICT_RULES_BASE,
    ...(hasBrowser ? STRICT_RULES_BROWSER : {}),
    ...(hasNode ? STRICT_RULES_NODE : {})
  };

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
    },
    ...(strict
      ? [
          {
            name: "@fauziralpiandi/eslint-config/javascript/strict",
            files: [...GLOB.JS],
            rules: strictRules
          }
        ]
      : [])
  ];
}

function normalizeEnv(env?: EnvOption): EnvName[] {
  if (!env) return DEFAULT_ENV;
  if (Array.isArray(env)) return env;

  return [env];
}
