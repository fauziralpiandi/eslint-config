import { GLOB } from "../shared/glob.js";
import type { Config } from "../shared/types.js";
import {
  isPackageAvailable,
  loadTypescriptEslint,
  resolveGlobals,
  resolveTsconfigProjects,
  type EnvName,
  type EnvOption
} from "../shared/utils.js";

type TsOptions = {
  env?: EnvOption;
  strict?: boolean;
};

const NO_UNSAFE_RULES_WARN = {
  "@typescript-eslint/no-unsafe-argument": "warn",
  "@typescript-eslint/no-unsafe-assignment": "warn",
  "@typescript-eslint/no-unsafe-call": "warn",
  "@typescript-eslint/no-unsafe-declaration-merging": "warn",
  "@typescript-eslint/no-unsafe-enum-comparison": "warn",
  "@typescript-eslint/no-unsafe-function-type": "warn",
  "@typescript-eslint/no-unsafe-member-access": "warn",
  "@typescript-eslint/no-unsafe-return": "warn",
  "@typescript-eslint/no-unsafe-type-assertion": "warn",
  "@typescript-eslint/no-unsafe-unary-minus": "warn"
} as const;

const DEFAULT_ENV: EnvName[] = ["node", "browser"];

const STRICT_RULES_BASE: Config["rules"] = {
  "no-eval": "error",
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

const STRICT_RULES_UNTYPED: Config["rules"] = {
  "no-implied-eval": "error"
};

const STRICT_RULES_TYPECHECKED: Config["rules"] = {
  "@typescript-eslint/no-unsafe-type-assertion": "error"
};

export function typescriptConfig(options: TsOptions = {}): Config[] {
  const { env, strict = false } = options;

  if (!isPackageAvailable("typescript")) return [];

  const tseslint = loadTypescriptEslint();

  if (!tseslint) return [];

  const projectPaths = resolveTsconfigProjects();
  const typeChecked = projectPaths.length > 0;
  const resolvedEnv = normalizeEnv(env);
  const hasBrowser = resolvedEnv.includes("browser");
  const hasNode = resolvedEnv.includes("node");

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

  const unsafeRuleConfigs: Config[] =
    typeChecked && !strict
      ? [
          {
            name: "@fauziralpiandi/eslint-config/typescript/unsafe-warn",
            files: [...GLOB.TS],
            rules: NO_UNSAFE_RULES_WARN
          }
        ]
      : [];

  const strictRules: Config["rules"] | undefined = strict
    ? {
        ...STRICT_RULES_BASE,
        ...(typeChecked ? STRICT_RULES_TYPECHECKED : STRICT_RULES_UNTYPED),
        ...(hasBrowser ? STRICT_RULES_BROWSER : {}),
        ...(hasNode ? STRICT_RULES_NODE : {})
      }
    : undefined;

  const strictConfigs: Config[] = strict
    ? [
        {
          name: "@fauziralpiandi/eslint-config/typescript/strict",
          files: [...GLOB.TS],
          rules: strictRules
        }
      ]
    : [];

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
    ...unsafeRuleConfigs,
    ...strictConfigs
  ];
}

function normalizeEnv(env?: EnvOption): EnvName[] {
  if (!env) return DEFAULT_ENV;
  if (Array.isArray(env)) return env;

  return [env];
}
