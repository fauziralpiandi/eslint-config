import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";

import config, { type Config } from "./index.js";
import { DEFAULT_IGNORES } from "./shared/glob.js";

type ConfigWithLanguageOptions = Config & {
  languageOptions?: {
    globals?: Record<string, unknown>;
    parserOptions?: {
      project?: string[];
    };
  };
  rules?: Record<string, unknown>;
};

function findConfig(
  configs: Config[],
  nameFragment: string
): ConfigWithLanguageOptions | undefined {
  return configs.find((cfg) => cfg.name?.includes(nameFragment)) as
    | ConfigWithLanguageOptions
    | undefined;
}

function getRuleValue(configs: Config[], ruleName: string): unknown {
  let value: unknown;

  for (const config of configs as ConfigWithLanguageOptions[]) {
    if (config.rules && ruleName in config.rules) {
      value = config.rules[ruleName];
    }
  }

  return value;
}

function withTempDir<T>(
  files: Record<string, string>,
  run: (dir: string) => T
): T {
  const previousCwd = process.cwd();
  const dir = mkdtempSync(join(tmpdir(), "eslint-config-"));

  for (const [name, content] of Object.entries(files)) {
    writeFileSync(join(dir, name), content, "utf8");
  }

  process.chdir(dir);

  try {
    return run(dir);
  } finally {
    process.chdir(previousCwd);
    rmSync(dir, { recursive: true, force: true });
  }
}

async function loadTypescriptConfig() {
  vi.resetModules();

  const { typescriptConfig } = await import("./config/typescript.js");

  return typescriptConfig;
}

describe("typescriptConfig", () => {
  it("skips when typescript is not available", async () => {
    vi.resetModules();
    vi.doMock("./shared/utils.js", async () => {
      const actual =
        await vi.importActual<typeof import("./shared/utils.js")>(
          "./shared/utils.js"
        );

      return {
        ...actual,
        isPackageAvailable: () => false,
        loadTypescriptEslint: () => null
      };
    });

    const { typescriptConfig } = await import("./config/typescript.js");
    const configs = typescriptConfig({});

    expect(configs).toEqual([]);

    vi.doUnmock("./shared/utils.js");
    vi.resetModules();
  });

  it("uses base configs when no tsconfig is present", async () => {
    const typescriptConfig = await loadTypescriptConfig();

    withTempDir({}, () => {
      const configs = typescriptConfig({});
      const hasBase = configs.some((config) =>
        config.name?.includes("/base-0")
      );
      const setup = findConfig(configs, "/setup");

      expect(hasBase).toBe(true);
      expect(setup?.languageOptions?.parserOptions).toBeUndefined();
    });
  });

  it("uses type-checked configs when tsconfig is present", async () => {
    const typescriptConfig = await loadTypescriptConfig();

    withTempDir({ "tsconfig.json": "{}" }, () => {
      const configs = typescriptConfig({});
      const hasTypeChecked = configs.some((config) =>
        config.name?.includes("/type-checked-0")
      );
      const setup = findConfig(configs, "/setup");

      expect(hasTypeChecked).toBe(true);
      expect(setup?.languageOptions?.parserOptions?.project).toEqual([
        "./tsconfig.json"
      ]);
    });
  });

  it("recognizes tsconfig.jsonc", async () => {
    const typescriptConfig = await loadTypescriptConfig();

    withTempDir({ "tsconfig.jsonc": "{}" }, () => {
      const configs = typescriptConfig({});
      const hasTypeChecked = configs.some((config) =>
        config.name?.includes("/type-checked-0")
      );

      expect(hasTypeChecked).toBe(true);
    });
  });

  it("recognizes tsconfig.json5", async () => {
    const typescriptConfig = await loadTypescriptConfig();

    withTempDir({ "tsconfig.json5": "{}" }, () => {
      const configs = typescriptConfig({});
      const hasTypeChecked = configs.some((config) =>
        config.name?.includes("/type-checked-0")
      );

      expect(hasTypeChecked).toBe(true);
    });
  });

  it("downgrades no-unsafe rules to warn when strict is false", async () => {
    const typescriptConfig = await loadTypescriptConfig();

    withTempDir({ "tsconfig.json": "{}" }, () => {
      const configs = typescriptConfig({});
      const unsafeConfig = findConfig(configs, "/unsafe-warn");

      expect(
        unsafeConfig?.rules?.["@typescript-eslint/no-unsafe-assignment"]
      ).toBe("warn");
      expect(
        unsafeConfig?.rules?.["@typescript-eslint/no-unsafe-member-access"]
      ).toBe("warn");
    });
  });

  it("keeps no-unsafe rules as error when strict is true", async () => {
    const typescriptConfig = await loadTypescriptConfig();

    withTempDir({ "tsconfig.json": "{}" }, () => {
      const configs = typescriptConfig({ strict: true });
      const unsafeConfig = findConfig(configs, "/unsafe-warn");

      expect(unsafeConfig).toBeUndefined();
      expect(
        getRuleValue(configs, "@typescript-eslint/no-unsafe-assignment")
      ).toBe("error");
    });
  });

  it("adds strict typescript rules when strict is true", async () => {
    const typescriptConfig = await loadTypescriptConfig();

    withTempDir({ "tsconfig.json": "{}" }, () => {
      const configs = typescriptConfig({ strict: true });
      const strictConfig = findConfig(configs, "/typescript/strict");

      expect(strictConfig?.rules?.["no-eval"]).toBe("error");
      expect(strictConfig?.rules?.["no-script-url"]).toBe("error");
      expect(
        strictConfig?.rules?.["@typescript-eslint/no-unsafe-type-assertion"]
      ).toBe("error");
    });
  });

  it("uses untyped strict rules when no tsconfig is present", async () => {
    const typescriptConfig = await loadTypescriptConfig();

    withTempDir({}, () => {
      const configs = typescriptConfig({ strict: true });
      const strictConfig = findConfig(configs, "/typescript/strict");

      expect(strictConfig?.rules?.["no-implied-eval"]).toBe("error");
      expect(
        strictConfig?.rules?.["@typescript-eslint/no-unsafe-type-assertion"]
      ).toBeUndefined();
    });
  });

  it("limits browser-only strict rules when env is node", async () => {
    const typescriptConfig = await loadTypescriptConfig();

    withTempDir({ "tsconfig.json": "{}" }, () => {
      const configs = typescriptConfig({ strict: true, env: "node" });
      const strictConfig = findConfig(configs, "/typescript/strict");

      expect(strictConfig?.rules?.["no-process-exit"]).toBe("error");
      expect(strictConfig?.rules?.["no-script-url"]).toBeUndefined();
      expect(strictConfig?.rules?.["no-alert"]).toBeUndefined();
    });
  });
});

describe("config", () => {
  it("puts global ignores first", () => {
    const result = config();

    expect(result[0]?.name).toBe(
      "@fauziralpiandi/eslint-config/global-ignores"
    );
  });

  it("merges default ignores with user ignores", () => {
    const customIgnores = ["**/custom/**"];
    const result = config({ ignores: customIgnores });
    const ignores = result[0]?.ignores ?? [];

    expect(ignores.slice(0, DEFAULT_IGNORES.length)).toEqual(DEFAULT_IGNORES);
    expect(ignores.slice(DEFAULT_IGNORES.length)).toEqual(customIgnores);
  });

  it("keeps default ignores when user ignores is empty", () => {
    const result = config({ ignores: [] });

    expect(result[0]?.ignores).toEqual(DEFAULT_IGNORES);
  });

  it("appends user configs at the end", () => {
    const userConfig: Config = { name: "user-config" };
    const result = config({}, userConfig);

    expect(result.at(-1)).toEqual(userConfig);
  });

  it("defaults env to both (node + browser)", () => {
    const result = config();
    const setup = findConfig(result, "/javascript/setup");

    const globals = setup?.languageOptions?.globals ?? {};

    expect("window" in globals).toBe(true);
    expect("process" in globals).toBe(true);
  });

  it("applies node globals when env is node", () => {
    const result = config({ env: "node" });
    const setup = findConfig(result, "/javascript/setup");

    const globals = setup?.languageOptions?.globals ?? {};

    expect("process" in globals).toBe(true);
    expect("window" in globals).toBe(false);
  });

  it("applies browser globals when env is browser", () => {
    const result = config({ env: "browser" });
    const setup = findConfig(result, "/javascript/setup");

    const globals = setup?.languageOptions?.globals ?? {};

    expect("window" in globals).toBe(true);
    expect("process" in globals).toBe(false);
  });

  it("adds strict javascript rules when strict is true", () => {
    const result = config({ strict: true });
    const strictConfig = findConfig(result, "/javascript/strict");

    expect(strictConfig?.rules?.["no-eval"]).toBe("error");
    expect(strictConfig?.rules?.["no-script-url"]).toBe("error");
    expect(strictConfig?.rules?.["no-process-exit"]).toBe("error");
  });

  it("limits browser-only strict rules when env is node", () => {
    const result = config({ strict: true, env: "node" });
    const strictConfig = findConfig(result, "/javascript/strict");

    expect(strictConfig?.rules?.["no-process-exit"]).toBe("error");
    expect(strictConfig?.rules?.["no-script-url"]).toBeUndefined();
    expect(strictConfig?.rules?.["no-alert"]).toBeUndefined();
  });

  it("skips strict javascript rules when strict is false", () => {
    const result = config({ strict: false });
    const strictConfig = findConfig(result, "/javascript/strict");

    expect(strictConfig).toBeUndefined();
  });
});
