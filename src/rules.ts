import type { Linter } from 'eslint';

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isRuleEqual(
  a: Linter.RuleEntry | undefined,
  b: Linter.RuleEntry | undefined
): boolean {
  if (a === b) return true;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;

    for (const [i, element] of a.entries()) {
      if (!isRuleEqual(element as Linter.RuleEntry, b[i] as Linter.RuleEntry)) {
        return false;
      }
    }

    return true;
  }

  if (isObject(a) && isObject(b)) {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);

    if (aKeys.length !== bKeys.length) return false;

    for (const key of aKeys) {
      if (!isRuleEqual(a[key] as Linter.RuleEntry, b[key] as Linter.RuleEntry))
        return false;
    }

    return true;
  }

  return false;
}

export function filterRuleOverrides(
  base: Linter.RulesRecord,
  overrides: Linter.RulesRecord
): Linter.RulesRecord {
  const result: Linter.RulesRecord = {};

  for (const [name, value] of Object.entries(overrides)) {
    if (!isRuleEqual(base[name], value)) {
      result[name] = value;
    }
  }

  return result;
}
